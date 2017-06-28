function createAuthorization(serviceName, serviceRegion, clientId, clientKey, requestUri, requestMethod, queryParams, headerParams, requestBody, requestTimestamp) {

    var authScheme = "WSS";
    var authType = "wss-request";
    var authAlgorithm = "WSS-HMAC-SHA256";
    var canonicalUri = uriEncode(requestUri, !1);
    var canonicalQueryString = "";
    var unsignedPayload = "UNSIGNED-PAYLOAD";

    for (var queryParam in queryParams)canonicalQueryString.length > 0 && (canonicalQueryString += "&"), canonicalQueryString += uriEncode(queryParam, !0) + "=" + uriEncode(queryParams[queryParam], !0);

    var canonicalHeaders = "";
    var signedHeaderNames = "";

    for (var headerParam in headerParams)canonicalHeaders.length > 0 && (canonicalHeaders += "\n", signedHeaderNames += ";"), canonicalHeaders += headerParam.toLowerCase() + ":" + headerParams[headerParam].trim(), signedHeaderNames += headerParam.toLowerCase();

    var canonicalPayload = requestBody ? sha256Hash(requestBody) : unsignedPayload;

    var canonicalRequest = requestMethod + "\n" + canonicalUri + "\n" + canonicalQueryString + "\n" + canonicalHeaders + "\n" + signedHeaderNames + "\n" + canonicalPayload;

    var canonicalTimestamp = yyyyMMddTHHmmssZ(requestTimestamp);

    var canonicalScope = yyyyMMdd(requestTimestamp) + "/" + serviceRegion + "/" + serviceName + "/" + authType;

    var stringToSign = authAlgorithm + "\n" + canonicalTimestamp + "\n" + canonicalScope + "\n" + sha256Hash(canonicalRequest);

    var dateKey = hmacSha256(authScheme + clientKey, yyyyMMdd(requestTimestamp));
    var dateRegionKey = hmacSha256(dateKey, serviceRegion);
    var dateRegionServiceKey = hmacSha256(dateRegionKey, serviceName);
    var finalSigningKey = hmacSha256(dateRegionServiceKey, authType);

    var signature = hex(hmacSha256(finalSigningKey, stringToSign));

    var authorization = authAlgorithm + " Credential=" + clientId + "/" + canonicalScope + ",SignedHeaders=" + signedHeaderNames + ",Signature=" + signature;

    return authorization;
}

function hex(src) {
    return src.toString(CryptoJS.enc.Hex).toLowerCase()
}

function sha256Hash(data) {
    return hex(CryptoJS.SHA256(data))
}

function hmacSha256(key, data) {
    return CryptoJS.HmacSHA256(data, key)
}

function yyyyMMdd(timestamp) {
    return timestamp.getUTCFullYear() + "" + zeroPad(timestamp.getUTCMonth() + 1) + "" + zeroPad(timestamp.getUTCDate())
}

function yyyyMMddTHHmmssZ(timestamp) {
    return timestamp.getUTCFullYear() + "" + zeroPad(timestamp.getUTCMonth() + 1) + "" + zeroPad(timestamp.getUTCDate()) + "T" + zeroPad(timestamp.getUTCHours()) + zeroPad(timestamp.getUTCMinutes()) + zeroPad(timestamp.getUTCSeconds()) + "Z"
}

var toWordArray = function (src) {
    return CryptoJS.enc.Utf8.parse(src)
}

var zeroPad = function (src) {
    return src < 10 ? "0" + src : src
}

function uriEncode(source, slashEncode) {
    for (var encoded = "", a = 0; a < source.length; a++) {
        var r = source.substr(a, 1);
        encoded += r >= "A" && "Z" >= r || r >= "a" && "z" >= r || r >= "0" && "9" >= r || "_" == r || "-" == r || "~" == r || "." == r || "/" == r && !slashEncode ? r : "%" + hex(toWordArray(r)).toUpperCase()
    }
    return encoded
}