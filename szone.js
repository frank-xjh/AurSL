export default class szone {
    #headers = {
        Version: "4.1.8",
    };

    #urlencodeform = {
        "Content-Type": "application/x-www-form-urlencoded",
    };

    #jsonform = {
        "Content-Type": "application/json",
    };

    #userinfo = {};
    #userguid;
    #token;

    _alert(text) {}

    constructor() {
        if (this.getStorage())
            this._updateUserInfo().then((data) => {
                /*
                if (data.status == 200) {
                    if (window.location.pathname != "/home.html") window.location.href = "home.html";
                } else {
                    this.setToken();
                    if (window.location.pathname == "/home.html") window.location.href = "index.html";
                }
                */
            });
        else {
            if (window.location.pathname == "/home.html") window.location.href = "index.html";
        }
    }

    getStorage() {
        this.#token = sessionStorage.getItem("token");
        if (sessionStorage.getItem("userinfo")) this.#userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
        this.#userguid = sessionStorage.getItem("userguid");
        if (!this.#token) return false;
        this.#headers.Token = this.#token;
        return true;
    }

    setToken(token) {
        this.#userinfo = {};
        sessionStorage.setItem("userinfo", "");
        this.#userguid = "";
        sessionStorage.setItem("userguid", "");
        this.#token = token;
        sessionStorage.setItem("token", token);
        this.#headers.Token = token;
    }

    getToken() {
        return this.#token;
    }

    getUserData(res) {
        return this.#userinfo[res];
    }

    _transToForm(data) {
        let f = [];
        for (const k in data) {
            f.push(k + "=" + data[k]);
        }
        return f.join("&");
    }

    getUrl(host, path) {
        switch (host) {
            case "my":
                return "https://szone-my.7net.cc" + path;
            case "old":
                return "https://szone-api.7net.cc" + path;
            case "score":
                return "https://szone-score.7net.cc" + path;
            default:
                return undefined;
        }
    }

    async _dataFetch(host, path, method, data, notoken) {
        method = method;
        let headers = {};
        Object.assign(headers, this.#headers);
        if (notoken) delete headers.Token;

        if (method == "GET") {
            return fetch(this.getUrl(host, path) + (data ? "?" + this._transToForm(data) : ""), {
                method: method,
                headers: headers,
            })
                .then((res) => {
                    return res.json();
                })
                .catch((_err) => {
                    console.log("Network Error1");
                });
        } else {
            return fetch(this.getUrl(host, path), {
                method: method,
                headers: Object.assign(this.#urlencodeform, headers),
                body: this._transToForm(data),
            })
                .then((res) => res.json())
                .catch((_err) => {
                    console.log("Network Error2");
                });
        }
    }

    async getExamList(rows) {
        return this._dataFetch(
            "score",
            "/exam/getClaimExams?startIndex=0&rows=" +
                rows +
                "&studentName=" +
                encodeURI(this.#userinfo.studentName) +
                "&schoolGuid=" +
                this.#userinfo.schoolGuid +
                "&grade=" +
                this.#userinfo.currentGrade,
            "GET"
        ).then((data) => {
            return data.data.list;
        });
    }

    async getExamData(examGuid, examType, studentCode) {
        let data = {
            examGuid: examGuid,
            examType: examType,
            ruCode: this.#userinfo.ruCode,
            schoolGuid: this.#userinfo.schoolGuid,
            studentCode: studentCode,
            grade: this.#userinfo.currentGrade,
        };
        return this._dataFetch("score", "/Question/Subjects", "POST", data)
            .then((data) => {
                if (data.status == 200) return data.data.subjects;
            })
            .catch((_err) => {
                return;
            });
    }

    async _updateUserInfo() {
        return this._dataFetch("my", "/userInfo/GetUserInfo", "GET").then((data) => {
            if (data.status == 200) {
                this.#userinfo = data.data;
                sessionStorage.setItem("userinfo", JSON.stringify(data.data));
                this.#userguid = data.data.userGuid;
                sessionStorage.setItem("userguid", data.data.userGuid);
            }
            return data;
        });
    }

    async getUserInfo() {
        return new Promise((resolve, _reject) => {
            resolve(this._updateUserInfo());
        });
    }

    async login(data) {
        return this._dataFetch("my", "/login", "POST", data, true).then((json) => {
            if (json.status == 200) {
                this.setToken(json.data.token);
            }
            return json;
        });
    }
}
