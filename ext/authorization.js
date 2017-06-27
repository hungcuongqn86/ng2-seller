function hex(e) {
    return e.toString(CryptoJS.enc.Hex).toLowerCase()
}
function sha256Hash(e) {
    return hex(CryptoJS.SHA256(e))
}
function hmacSha256(e, n) {
    return CryptoJS.HmacSHA256(n, e)
}
function uriEncode(e, n) {
    for (var t = "", a = 0; a < e.length; a++) {
        var r = e.substr(a, 1);
        t += r >= "A" && "Z" >= r || r >= "a" && "z" >= r || r >= "0" && "9" >= r || "_" == r || "-" == r || "~" == r || "." == r || "/" == r && !n ? r : "%" + hex(toWordArray(r)).toUpperCase()
    }
    return t
}
function yyyyMMddTHHmmssZ(e) {
    return e.getUTCFullYear() + "" + pad(e.getUTCMonth() + 1) + "" + pad(e.getUTCDate()) + "T" + pad(e.getUTCHours()) + pad(e.getUTCMinutes()) + pad(e.getUTCSeconds()) + "Z"
}
function yyyyMMdd(e) {
    return e.getUTCFullYear() + "" + pad(e.getUTCMonth() + 1) + "" + pad(e.getUTCDate())
}
function createAuthorization(e, n, t, a, r, o, i, s, y, m, p) {
    var d = "WSS-HMAC-SHA256", c = "wss-request", u = uriEncode(o, !1), h = "";
    for (var M in i)h.length > 0 && (h += "&"), h += uriEncode(M, !0) + "=" + uriEncode(i[M], !0);
    var T = "", S = "";
    for (var g in s)T.length > 0 && (T += "\n", S += ";"), T += g.toLowerCase() + ":" + s[g].trim(), S += g.toLowerCase();
    var C = y ? sha256Hash(y) : "UNSIGNED-PAYLOAD", l = r + "\n" + u + "\n" + h + "\n" + T + "\n" + S + "\n" + C,
        E = yyyyMMddTHHmmssZ(m), x = yyyyMMdd(m) + "/" + t + "/" + a + "/" + c,
        H = d + "\n" + E + "\n" + x + "\n" + sha256Hash(l), V = hmacSha256("WSS" + n, yyyyMMdd(m)),
        v = hmacSha256(V, t), A = hmacSha256(v, a), U = hmacSha256(A, c), w = hex(hmacSha256(U, H)),
        O = hex(toWordArray('{\n  "canonicalRequest":"' + l + '",\n  "stringToSign":"' + H + '",\n  "dateKey":"' + hex(V) + '",\n  "dateRegionKey":"' + hex(v) + '",\n  "dateRegionServiceKey":"' + hex(A) + '",\n  "signingKey":"' + U + '"\n}'));
    return postman.setEnvironmentVariable("debugInfo", O), postman.setEnvironmentVariable("signature", w), d + " Credential=" + e + "/" + x + ",SignedHeaders=" + S + ",Signature=" + w
}
var toWordArray = function (e) {
    return CryptoJS.enc.Utf8.parse(e)
}, pad = function (e) {
    return 10 > e ? "0" + e : e
}, timeStamp = new Date, expires = "3600", payload = '';
postman.setEnvironmentVariable("X-Date", yyyyMMddTHHmmssZ(timeStamp)), postman.setEnvironmentVariable("X-OP-Expires", expires), postman.setEnvironmentVariable("X-Authorization", createAuthorization(environment.accessKeyId, environment.secretAccessKey, "onepay", "msp", "POST", "/msp/api/v1/orders", {}, {
    Host: "localhost:8080",
    "X-Date": yyyyMMddTHHmmssZ(timeStamp),
    "X-Expires": expires
}, payload, timeStamp, expires)), postman.setEnvironmentVariable("payload", payload);