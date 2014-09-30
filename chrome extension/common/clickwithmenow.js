/*! Click With Me Now
 * @author Click With Me Now, Inc. <info@clickwithmenow.com>
 * @version 2.3.2
 * @license Unauthorized copying of this file, via any medium is strictly prohibited.
 * This file cannot be copied and/or distributed without express written consent from @author.
 * @builddate 2014/09/25
 */
function CwmnCanvasDiff() {
    var sourceCanvases, numWorkers, idleWorkers, callback, diffCallback, blockSize, blockRows, jobSize, totalLength, chunk, canvasPixels, diffQuads, progress, timeStamp, blobURL, workers = [],
        parseArgs = function(canvases, userCallback, diffResult, blockOptions) {
            if (callback = userCallback, diffCallback = diffResult, blockOptions = blockOptions || {}, canvases.length < 2) throw "You must supply at least two canvases to compare.";
            sourceCanvases = canvases, blockSize = blockOptions.blockSize || 50, blockRows = blockOptions.blockRows || 1, numWorkers = blockOptions.workers || 2, timeStamp = blockOptions.timeStamp || (new Date).getTime()
        },
        returnOutput = function() {
            var retVal = {};
            retVal.sourceCanvases = sourceCanvases, retVal.affectedQuads = diffQuads, callback(retVal)
        },
        manageWorkers = function() {
            idleWorkers = 0, workers.length < numWorkers ? createWorkers(numWorkers - workers.length) : workers.length > numWorkers && terminateWorkers(workers.length - numWorkers)
        },
        createWorkers = function(newWorkers) {
            var blob = new Blob([document.querySelector("#pixel-worker").textContent], {
                type: "text/javascript"
            });
            blobURL = window.URL.createObjectURL(blob);
            for (var i = 0; newWorkers > i; i++) try {
                var worker = new Worker(blobURL);
                worker.addEventListener("message", workerCallback), workers.push(worker)
            } catch (err) {}
        },
        terminateWorkers = function(redundant) {
            var redundancies = workers.splice(workers.length - 1 - redundant, redundant);
            for (var r in redundancies) redundancies[r].terminate()
        },
        assignJobs = function(employeeId) {
            var work = getWork(),
                width = jobSize / blockSize / blockRows;
            workers[employeeId].postMessage({
                employeeId: employeeId,
                blockSize: blockSize,
                set1: work.set1,
                set2: work.set2,
                rowOffset: work.set1.byteOffset / 4 / width / blockSize,
                width: width,
                height: blockSize * blockRows
            }), progress += work.chunk
        },
        getWork = function() {
            var length = totalLength > progress + chunk ? chunk : totalLength - progress;
            return {
                chunk: length,
                set1: canvasPixels[0].subarray(progress, progress + length),
                set2: canvasPixels[1].subarray(progress, progress + length)
            }
        },
        workerCallback = function(e) {
            switch (e.data.type) {
                case "console":
                    break;
                case "complete":
                    generateDiffBlocks(e.data.results), diffQuads = extend(diffQuads, e.data.results), checkForWork(e.data.worker)
            }
        },
        checkForWork = function(employeeId) {
            return workComplete() ? (idleWorkers++, void(idleWorkers == numWorkers && returnOutput())) : void assignJobs(employeeId)
        },
        workComplete = function() {
            return totalLength == progress
        },
        extend = function(options, defaults) {
            for (var key in options) options.hasOwnProperty(key) && (defaults[key] = options[key]);
            return defaults
        },
        generateDiffBlocks = function(blocks) {
            for (var c = 0; c < blocks.length; c++)
                if (blocks[c])
                    for (var r = 0; r < blocks[c].length; r++)
                        if (blocks[c][r]) {
                            var diffPixels = sourceCanvases[1].getContext("2d").getImageData(c * blockSize, r * blockSize, blockSize, blockSize),
                                diffCanvas = document.createElement("canvas"),
                                diffCanvasCtx = diffCanvas.getContext("2d");
                            diffCanvas.width = diffCanvas.height = blockSize, diffCanvasCtx.putImageData(diffPixels, 0, 0), diffCallback({
                                id: timeStamp,
                                imgString: diffCanvas.toDataURL(),
                                x: c * blockSize,
                                y: r * blockSize,
                                width: blockSize,
                                height: blockSize
                            })
                        }
        },
        generateDiff = function() {
            var widths = [],
                heights = [];
            sourceCanvases.forEach(function(c) {
                widths.push(c.width), heights.push(c.height)
            }); {
                var newWidth = Math.max.apply(Math, widths);
                Math.max.apply(Math, heights)
            }
            jobSize = blockSize * newWidth * blockRows, chunk = 4 * jobSize, diffQuads = {}, progress = 0, canvasPixels = [], sourceCanvases.forEach(function(can) {
                canvasPixels.push(can.getContext("2d").getImageData(0, 0, can.width, can.height).data)
            }), totalLength = canvasPixels[0].length, manageWorkers();
            for (var w = 0; w < workers.length; w++) assignJobs(w)
        },
        destroy = function() {
            window.URL.revokeObjectURL(blobURL)
        };
    return {
        diff: function(canvases, userCallback, diffResult, blockOptions) {
            parseArgs(canvases, userCallback, diffResult, blockOptions), generateDiff()
        },
        destroy: function() {
            destroy()
        }
    }
}

function loadHelpers(Cwmn) {
    function varIsSet(element) {
        return null !== element && void 0 !== element ? !0 : void 0
    }

    function buildDebugger(id) {
        var debug = document.createElement("ul");
        return debug.setAttribute("id", id), document.body.appendChild(debug), debug
    }
    return function(window) {
        "use strict";
        var CwmnDOM = function(callback) {
                readyBound = !1, CwmnDOM.isReady = !1, "function" == typeof callback && (DOMReadyCallback = callback), bindReady()
            },
            document = window.document,
            readyBound = !1,
            DOMReadyCallback = function() {},
            DOMContentLoaded = function() {
                document.addEventListener ? document.removeEventListener("DOMContentLoaded", DOMContentLoaded, !1) : document.detachEvent("onreadystatechange", DOMContentLoaded), new DOMReady
            },
            DOMReady = function() {
                if (!CwmnDOM.isReady) {
                    if (!document.body) return window.requestAnimationFrame(DOMReady);
                    CwmnDOM.isReady = !0, new DOMReadyCallback
                }
            },
            bindReady = function() {
                var toplevel = !1;
                if (!readyBound)
                    if (readyBound = !0, "loading" !== document.readyState && new DOMReady, document.addEventListener) document.addEventListener("DOMContentLoaded", DOMContentLoaded, !1), window.addEventListener("load", DOMContentLoaded, !1);
                    else if (document.attachEvent) {
                    document.attachEvent("onreadystatechange", DOMContentLoaded), window.attachEvent("onload", DOMContentLoaded);
                    try {
                        toplevel = null === window.frameElement
                    } catch (e) {}
                    document.documentElement.doScroll && toplevel && doScrollCheck()
                }
            },
            doScrollCheck = function() {
                if (!CwmnDOM.isReady) {
                    try {
                        document.documentElement.doScroll("left")
                    } catch (error) {
                        return void window.requestAnimationFrame(doScrollCheck)
                    }
                    new DOMReady
                }
            };
        CwmnDOM.isReady = !1, Cwmn.DomLoaded = CwmnDOM
    }(window), Cwmn.AlertifyLogDelay = 1e4, Cwmn.enablePublic = !1, Cwmn.getById = function(id) {
        return document.getElementById(id)
    }, Cwmn.getByTag = function(tag) {
        return document.getElementsByTagName(tag)
    }, Cwmn.logger = function(input) {
        if (Cwmn.options.debug) {
            if (!Cwmn.options.hideDebug && !/Engine Rendered/g.test(input)) {
                var debug = Cwmn.getById("cwmn-debugger");
                debug || (debug = buildDebugger("cwmn-debugger"));
                var msg = document.createElement("li");
                msg.innerHTML = input, debug.insertBefore(msg, debug.firstChild)
            }
            try {
                console.log("[CWMN] " + input)
            } catch (e) {} finally {
                return
            }
        }
    }, Cwmn.loadCss = function(file) {
        Cwmn.logger("Loading CSS " + file.split("/").pop());
        for (var ss = document.styleSheets, i = 0, max = ss.length; max > i; i++)
            if (ss[i].href == file) return;
        var link = document.createElement("link");
        link.rel = "stylesheet", link.type = "text/css", link.href = file, Cwmn.getByTag("head")[0].appendChild(link)
    }, Cwmn.loadWorker = function(url, callback) {
        Cwmn.logger("Loading Worker");
        var onSuccess = function(resp) {
                if (resp.error) callback("Error Loading Web Worker.");
                else {
                    var head = document.getElementsByTagName("head")[0],
                        script = document.createElement("script"),
                        workerJS = JSON.parse(resp.data).replace(/(\r\n|\n|\r)/gm, "");
                    script.type = "text/web-worker", script.textContent = workerJS, script.id = "pixel-worker", head.appendChild(script)
                }
            },
            onError = function(err) {
                Cwmn.logger(err)
            };
        Cwmn.ajax(url + "?callback=?", null, onSuccess, onError)
    }, Cwmn.loadScript = function(url, callback, zone) {
    	console.debug("loading script: " + url);
        function handleLoad() {
            done || (done = !0, callback())
        }

        function handleReadyStateChange() {
            var state;
            done || (state = script.readyState, "complete" === state && handleLoad())
        }
        Cwmn.logger("Loading Script " + url.split("/").pop());
        var js = Cwmn.getByTag("script"),
            done = !1;
        zone = zone || "head";
        for (var i = 0, max = js.length; max > i; i++)
            if (js[i].src == url) return;
        var head = Cwmn.getByTag(zone)[0],
            script = document.createElement("script");
        console.log(head);
        console.log(script);
        script.type = "text/javascript", script.src = url, script.onload = handleLoad, script.onreadystatechange = handleReadyStateChange, head.appendChild(script)
    }, Cwmn.loadScriptCallback = function(varArray, callback, name) {
    	console.log(varArray);
    	console.log(callback);
    	console.log(name);
        Cwmn.loadedLibs = !1, Cwmn.loadLibsTimer = void 0, Cwmn.loadLibsCount = 0, Cwmn.loadLibsTimer = setInterval(function() {
            Cwmn.loadLibsCount++; 
            console.debug("Interval=" + Cwmn.loadLibsCount); 
            if (Cwmn.loadLibsCount > 60) {
            	Cwmn.logger("Unable to load " + name); 
            	clearInterval(Cwmn.loadLibsTimer);
            }
            console.log(varArray);
            if (varArray.every(varIsSet)) {
            	clearInterval(Cwmn.loadLibsTimer); 
            	Cwmn.loadedLibs || (Cwmn.loadedLibs = !0, callback());
            }
        }, 500);
        console.log(Cwmn.loadedLibs);
    }, Cwmn.validateForm = function(formInputs) {
        var i, formItem, params = {},
            errors = !1;
        for (i in formInputs) formItem = formInputs[i], ("input" === formItem.localName || "textarea" === formItem.localName) && ("cwmn-guestEmail" === formItem.name || "cwmn-hostEmail" === formItem.name ? Cwmn.validateEmail(formItem) ? params[formItem.name] = Cwmn.fixedEncodeURIComponent(formItem.value) : errors = !0 : "hidden" === formItem.type ? params[formItem.name] = Cwmn.fixedEncodeURIComponent(formItem.value) : Cwmn.validateInput(formItem) ? params[formItem.name] = Cwmn.fixedEncodeURIComponent(formItem.value) : errors = !0);
        return errors ? !1 : params
    }, Cwmn.validFormInput = function(input) {
        input.setAttribute("style", "border: 1px solid #ccc;")
    }, Cwmn.validateInput = function(input) {
        var msg = input.parentNode.getElementsByClassName("start-error-message");
        return msg.length > 0 && msg[0].parentNode.removeChild(msg[0]), 0 === input.value.length ? (Cwmn.formValidationError(input), !1) : (Cwmn.validFormInput(input), !0)
    }, Cwmn.validateEmail = function(input) {
        if (Cwmn.validateInput(input)) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
            return re.test(input.value) ? !0 : (Cwmn.formValidationError(input, "invalid email address"), !1)
        }
        return !1
    }, Cwmn.formValidationError = function(input, msg) {
        var msgSpan = document.createElement("span");
        msgSpan.setAttribute("class", "start-error-message"), msgSpan.innerHTML = msg || "can't be blank", input.setAttribute("style", "border: 1px solid #f00;"), input.parentNode.appendChild(msgSpan)
    }, Cwmn.mergeObjects = function(array) {
        for (var newObject = {}, i = 0; i < array.length; i++)
            for (var attr in array[i]) newObject[attr] = array[i][attr];
        return newObject
    }, Cwmn.viewport = function() {
        var e = window,
            a = "inner";
        return "innerWidth" in window || (a = "client", e = HTML || BODY), {
            width: e[a + "Width"],
            height: e[a + "Height"]
        }
    }, Cwmn.fixedEncodeURIComponent = function(str) {
        return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A")
    }, Cwmn.compact_array = function(arr, value) {
        for (var i = 0; i < arr.length; i++) arr[i] == value && (arr.splice(i, 1), i--);
        return arr
    }, Cwmn.removeScriptCssFile = function(filename, filetype) {
        Cwmn.logger("Removing JS/CSS " + filename);
        for (var targetelement = "js" == filetype ? "script" : "css" == filetype ? "link" : "none", targetattr = "js" == filetype ? "src" : "css" == filetype ? "href" : "none", allsuspects = Cwmn.getByTag(targetelement), i = allsuspects.length; i >= 0; i--) allsuspects[i] && null !== allsuspects[i].getAttribute(targetattr) && -1 != allsuspects[i].getAttribute(targetattr).indexOf(filename) && allsuspects[i].parentNode.removeChild(allsuspects[i])
    }, Cwmn.getStyle = function(elem, cssprop, cssprop2) {
        if (elem.currentStyle) return elem.currentStyle[cssprop];
        if (document.defaultView && document.defaultView.getComputedStyle) {
            var style = document.defaultView.getComputedStyle(elem, null).getPropertyValue(cssprop2);
            return "background-color" == cssprop2 && "rgba(0, 0, 0, 0)" == style && (style = "white"), style
        }
        return null
    }, Cwmn.supportsSocket = function() {
        return "WebSocket" in window
    }, Cwmn.ajax = function(url, params, success, error) {
        CwmnReqwest({
            url: url,
            type: "jsonp",
            crossOrigin: !0,
            data: params,
            success: success,
            error: error
        })
    }, Cwmn.addClass = function(obj, str) {
        obj.setAttribute("class", (obj.className.length ? obj.getAttribute("class") + " " : "") + str)
    }, Cwmn.removeClass = function(obj, str) {
        var reg = new RegExp(" *" + str, "g");
        obj.setAttribute("class", obj.getAttribute("class").replace(reg, ""))
    }, Cwmn.MD5 = function(s) {
        function L(k, d) {
            return k << d | k >>> 32 - d
        }

        function K(G, k) {
            var I, d, F, H, x;
            return F = 2147483648 & G, H = 2147483648 & k, I = 1073741824 & G, d = 1073741824 & k, x = (1073741823 & G) + (1073741823 & k), I & d ? 2147483648 ^ x ^ F ^ H : I | d ? 1073741824 & x ? 3221225472 ^ x ^ F ^ H : 1073741824 ^ x ^ F ^ H : x ^ F ^ H
        }

        function r(d, F, k) {
            return d & F | ~d & k
        }

        function q(d, F, k) {
            return d & k | F & ~k
        }

        function p(d, F, k) {
            return d ^ F ^ k
        }

        function n(d, F, k) {
            return F ^ (d | ~k)
        }

        function u(G, F, aa, Z, k, H, I) {
            return G = K(G, K(K(r(F, aa, Z), k), I)), K(L(G, H), F)
        }

        function f(G, F, aa, Z, k, H, I) {
            return G = K(G, K(K(q(F, aa, Z), k), I)), K(L(G, H), F)
        }

        function D(G, F, aa, Z, k, H, I) {
            return G = K(G, K(K(p(F, aa, Z), k), I)), K(L(G, H), F)
        }

        function t(G, F, aa, Z, k, H, I) {
            return G = K(G, K(K(n(F, aa, Z), k), I)), K(L(G, H), F)
        }

        function e(G) {
            for (var Z, F = G.length, x = F + 8, k = (x - x % 64) / 64, I = 16 * (k + 1), aa = Array(I - 1), d = 0, H = 0; F > H;) Z = (H - H % 4) / 4, d = H % 4 * 8, aa[Z] = aa[Z] | G.charCodeAt(H) << d, H++;
            return Z = (H - H % 4) / 4, d = H % 4 * 8, aa[Z] = aa[Z] | 128 << d, aa[I - 2] = F << 3, aa[I - 1] = F >>> 29, aa
        }

        function B(x) {
            var G, d, k = "",
                F = "";
            for (d = 0; 3 >= d; d++) G = x >>> 8 * d & 255, F = "0" + G.toString(16), k += F.substr(F.length - 2, 2);
            return k
        }

        function J(k) {
            k = k.replace(/rn/g, "n");
            for (var d = "", F = 0; F < k.length; F++) {
                var x = k.charCodeAt(F);
                128 > x ? d += String.fromCharCode(x) : x > 127 && 2048 > x ? (d += String.fromCharCode(x >> 6 | 192), d += String.fromCharCode(63 & x | 128)) : (d += String.fromCharCode(x >> 12 | 224), d += String.fromCharCode(x >> 6 & 63 | 128), d += String.fromCharCode(63 & x | 128))
            }
            return d
        }
        var P, h, E, v, g, Y, X, W, V, C = Array(),
            S = 7,
            Q = 12,
            N = 17,
            M = 22,
            A = 5,
            z = 9,
            y = 14,
            w = 20,
            o = 4,
            m = 11,
            l = 16,
            j = 23,
            U = 6,
            T = 10,
            R = 15,
            O = 21;
        for (s = J(s), C = e(s), Y = 1732584193, X = 4023233417, W = 2562383102, V = 271733878, P = 0; P < C.length; P += 16) h = Y, E = X, v = W, g = V, Y = u(Y, X, W, V, C[P + 0], S, 3614090360), V = u(V, Y, X, W, C[P + 1], Q, 3905402710), W = u(W, V, Y, X, C[P + 2], N, 606105819), X = u(X, W, V, Y, C[P + 3], M, 3250441966), Y = u(Y, X, W, V, C[P + 4], S, 4118548399), V = u(V, Y, X, W, C[P + 5], Q, 1200080426), W = u(W, V, Y, X, C[P + 6], N, 2821735955), X = u(X, W, V, Y, C[P + 7], M, 4249261313), Y = u(Y, X, W, V, C[P + 8], S, 1770035416), V = u(V, Y, X, W, C[P + 9], Q, 2336552879), W = u(W, V, Y, X, C[P + 10], N, 4294925233), X = u(X, W, V, Y, C[P + 11], M, 2304563134), Y = u(Y, X, W, V, C[P + 12], S, 1804603682), V = u(V, Y, X, W, C[P + 13], Q, 4254626195), W = u(W, V, Y, X, C[P + 14], N, 2792965006), X = u(X, W, V, Y, C[P + 15], M, 1236535329), Y = f(Y, X, W, V, C[P + 1], A, 4129170786), V = f(V, Y, X, W, C[P + 6], z, 3225465664), W = f(W, V, Y, X, C[P + 11], y, 643717713), X = f(X, W, V, Y, C[P + 0], w, 3921069994), Y = f(Y, X, W, V, C[P + 5], A, 3593408605), V = f(V, Y, X, W, C[P + 10], z, 38016083), W = f(W, V, Y, X, C[P + 15], y, 3634488961), X = f(X, W, V, Y, C[P + 4], w, 3889429448), Y = f(Y, X, W, V, C[P + 9], A, 568446438), V = f(V, Y, X, W, C[P + 14], z, 3275163606), W = f(W, V, Y, X, C[P + 3], y, 4107603335), X = f(X, W, V, Y, C[P + 8], w, 1163531501), Y = f(Y, X, W, V, C[P + 13], A, 2850285829), V = f(V, Y, X, W, C[P + 2], z, 4243563512), W = f(W, V, Y, X, C[P + 7], y, 1735328473), X = f(X, W, V, Y, C[P + 12], w, 2368359562), Y = D(Y, X, W, V, C[P + 5], o, 4294588738), V = D(V, Y, X, W, C[P + 8], m, 2272392833), W = D(W, V, Y, X, C[P + 11], l, 1839030562), X = D(X, W, V, Y, C[P + 14], j, 4259657740), Y = D(Y, X, W, V, C[P + 1], o, 2763975236), V = D(V, Y, X, W, C[P + 4], m, 1272893353), W = D(W, V, Y, X, C[P + 7], l, 4139469664), X = D(X, W, V, Y, C[P + 10], j, 3200236656), Y = D(Y, X, W, V, C[P + 13], o, 681279174), V = D(V, Y, X, W, C[P + 0], m, 3936430074), W = D(W, V, Y, X, C[P + 3], l, 3572445317), X = D(X, W, V, Y, C[P + 6], j, 76029189), Y = D(Y, X, W, V, C[P + 9], o, 3654602809), V = D(V, Y, X, W, C[P + 12], m, 3873151461), W = D(W, V, Y, X, C[P + 15], l, 530742520), X = D(X, W, V, Y, C[P + 2], j, 3299628645), Y = t(Y, X, W, V, C[P + 0], U, 4096336452), V = t(V, Y, X, W, C[P + 7], T, 1126891415), W = t(W, V, Y, X, C[P + 14], R, 2878612391), X = t(X, W, V, Y, C[P + 5], O, 4237533241), Y = t(Y, X, W, V, C[P + 12], U, 1700485571), V = t(V, Y, X, W, C[P + 3], T, 2399980690), W = t(W, V, Y, X, C[P + 10], R, 4293915773), X = t(X, W, V, Y, C[P + 1], O, 2240044497), Y = t(Y, X, W, V, C[P + 8], U, 1873313359), V = t(V, Y, X, W, C[P + 15], T, 4264355552), W = t(W, V, Y, X, C[P + 6], R, 2734768916), X = t(X, W, V, Y, C[P + 13], O, 1309151649), Y = t(Y, X, W, V, C[P + 4], U, 4149444226), V = t(V, Y, X, W, C[P + 11], T, 3174756917), W = t(W, V, Y, X, C[P + 2], R, 718787259), X = t(X, W, V, Y, C[P + 9], O, 3951481745), Y = K(Y, h), X = K(X, E), W = K(W, v), V = K(V, g);
        var i = B(Y) + B(X) + B(W) + B(V);
        return i.toLowerCase()
    }, Cwmn.removeParam = function(key, sourceURL) {
        var param, rtn = sourceURL.split("?")[0],
            params_arr = [],
            queryString = -1 !== sourceURL.indexOf("?") ? sourceURL.split("?")[1] : "";
        if ("" !== queryString) {
            params_arr = queryString.split("&");
            for (var i = params_arr.length - 1; i >= 0; i -= 1) param = params_arr[i].split("=")[0], param === key && params_arr.splice(i, 1);
            rtn = rtn + "?" + params_arr.join("&")
        }
        return rtn
    }, Cwmn
}

function loadLanguage(lang) {
        lang = lang || "en";
        var Langauge = {
            en: {
                options: {
                    startFormText: "I'd like to share this website with you, please Click With Me Now.",
                    startModalText: "Invite a friend to share my screen with me",
                    clickText: "Click With Me Now",
                    popoverText: "Share your screen with a friend!"
                },
                form: {
                    submit: "Send Invite",
                    hostName: "your name",
                    hostEmail: "your email",
                    guestName: "friends's name",
                    guestEmail: "friends's email",
                    message: "message"
                },
                loading: "Loading...",
                footer: {
                    endSession: "End Session",
                    privacyText: "privacy<br>mode",
                    privacyBtnOn: "ON",
                    privacyBtnOff: "OFF",
                    addGuest: "Add Guest",
                    messagePrivOn: "You are currently hiding your screen. Turn privacy off to share.",
                    messagePrivOff: "You are currently hosting a Click With Me Now session.",
                    emptyGuestList: "No Guests Invited",
                    silenceAllOn: "Hide All",
                    silenceAllOff: "Show All",
                    enablePublicLink: "Enable Public Link"
                },
                defaultName: "You",
                alertify: {
                    expired: "Your Click With Me Now session has expired.",
                    disconnect: "Click 'OK' to disconnect your Click With Me Now session.",
                    guestConnect: "has connected.",
                    guestDisconnect: "has disconnected."
                }
            }
        };
        return Langauge[lang]
    }! function(definition) {
        if ("function" == typeof bootstrap) bootstrap("promise", definition);
        else if ("object" == typeof exports) module.exports = definition();
        else if ("undefined" != typeof ses) {
            if (!ses.ok()) return;
            ses.makeQ = definition
        } else CwmnQ = definition()
    }(function() {
        "use strict";

        function uncurryThis(f) {
            return function() {
                return call.apply(f, arguments)
            }
        }

        function isObject(value) {
            return value === Object(value)
        }

        function isStopIteration(exception) {
            return "[object StopIteration]" === object_toString(exception) || exception instanceof QReturnValue
        }

        function makeStackTraceLong(error, promise) {
            if (hasStacks && promise.stack && "object" == typeof error && null !== error && error.stack && -1 === error.stack.indexOf(STACK_JUMP_SEPARATOR)) {
                for (var stacks = [], p = promise; p; p = p.source) p.stack && stacks.unshift(p.stack);
                stacks.unshift(error.stack);
                var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
                error.stack = filterStackString(concatedStacks)
            }
        }

        function filterStackString(stackString) {
            for (var lines = stackString.split("\n"), desiredLines = [], i = 0; i < lines.length; ++i) {
                var line = lines[i];
                isInternalFrame(line) || isNodeFrame(line) || !line || desiredLines.push(line)
            }
            return desiredLines.join("\n")
        }

        function isNodeFrame(stackLine) {
            return -1 !== stackLine.indexOf("(module.js:") || -1 !== stackLine.indexOf("(node.js:")
        }

        function getFileNameAndLineNumber(stackLine) {
            var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
            if (attempt1) return [attempt1[1], Number(attempt1[2])];
            var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
            if (attempt2) return [attempt2[1], Number(attempt2[2])];
            var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
            return attempt3 ? [attempt3[1], Number(attempt3[2])] : void 0
        }

        function isInternalFrame(stackLine) {
            var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
            if (!fileNameAndLineNumber) return !1;
            var fileName = fileNameAndLineNumber[0],
                lineNumber = fileNameAndLineNumber[1];
            return fileName === qFileName && lineNumber >= qStartingLine && qEndingLine >= lineNumber
        }

        function captureLine() {
            if (hasStacks) try {
                throw new Error
            } catch (e) {
                var lines = e.stack.split("\n"),
                    firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2],
                    fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
                if (!fileNameAndLineNumber) return;
                return qFileName = fileNameAndLineNumber[0], fileNameAndLineNumber[1]
            }
        }

        function deprecate(callback, name, alternative) {
            return function() {
                return "undefined" != typeof console && "function" == typeof console.warn && console.warn(name + " is deprecated, use " + alternative + " instead.", new Error("").stack), callback.apply(callback, arguments)
            }
        }

        function Q(value) {
            return isPromise(value) ? value : isPromiseAlike(value) ? coerce(value) : fulfill(value)
        }

        function defer() {
            function become(newPromise) {
                resolvedPromise = newPromise, promise.source = newPromise, array_reduce(messages, function(undefined, message) {
                    nextTick(function() {
                        newPromise.promiseDispatch.apply(newPromise, message)
                    })
                }, void 0), messages = void 0, progressListeners = void 0
            }
            var resolvedPromise, messages = [],
                progressListeners = [],
                deferred = object_create(defer.prototype),
                promise = object_create(Promise.prototype);
            if (promise.promiseDispatch = function(resolve, op, operands) {
                var args = array_slice(arguments);
                messages ? (messages.push(args), "when" === op && operands[1] && progressListeners.push(operands[1])) : nextTick(function() {
                    resolvedPromise.promiseDispatch.apply(resolvedPromise, args)
                })
            }, promise.valueOf = function() {
                if (messages) return promise;
                var nearerValue = nearer(resolvedPromise);
                return isPromise(nearerValue) && (resolvedPromise = nearerValue), nearerValue
            }, promise.inspect = function() {
                return resolvedPromise ? resolvedPromise.inspect() : {
                    state: "pending"
                }
            }, Q.longStackSupport && hasStacks) try {
                throw new Error
            } catch (e) {
                promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1)
            }
            return deferred.promise = promise, deferred.resolve = function(value) {
                resolvedPromise || become(Q(value))
            }, deferred.fulfill = function(value) {
                resolvedPromise || become(fulfill(value))
            }, deferred.reject = function(reason) {
                resolvedPromise || become(reject(reason))
            }, deferred.notify = function(progress) {
                resolvedPromise || array_reduce(progressListeners, function(undefined, progressListener) {
                    nextTick(function() {
                        progressListener(progress)
                    })
                }, void 0)
            }, deferred
        }

        function promise(resolver) {
            if ("function" != typeof resolver) throw new TypeError("resolver must be a function.");
            var deferred = defer();
            try {
                resolver(deferred.resolve, deferred.reject, deferred.notify)
            } catch (reason) {
                deferred.reject(reason)
            }
            return deferred.promise
        }

        function race(answerPs) {
            return promise(function(resolve, reject) {
                for (var i = 0, len = answerPs.length; len > i; i++) Q(answerPs[i]).then(resolve, reject)
            })
        }

        function Promise(descriptor, fallback, inspect) {
            void 0 === fallback && (fallback = function(op) {
                return reject(new Error("Promise does not support operation: " + op))
            }), void 0 === inspect && (inspect = function() {
                return {
                    state: "unknown"
                }
            });
            var promise = object_create(Promise.prototype);
            if (promise.promiseDispatch = function(resolve, op, args) {
                var result;
                try {
                    result = descriptor[op] ? descriptor[op].apply(promise, args) : fallback.call(promise, op, args)
                } catch (exception) {
                    result = reject(exception)
                }
                resolve && resolve(result)
            }, promise.inspect = inspect, inspect) {
                var inspected = inspect();
                "rejected" === inspected.state && (promise.exception = inspected.reason), promise.valueOf = function() {
                    var inspected = inspect();
                    return "pending" === inspected.state || "rejected" === inspected.state ? promise : inspected.value
                }
            }
            return promise
        }

        function when(value, fulfilled, rejected, progressed) {
            return Q(value).then(fulfilled, rejected, progressed)
        }

        function nearer(value) {
            if (isPromise(value)) {
                var inspected = value.inspect();
                if ("fulfilled" === inspected.state) return inspected.value
            }
            return value
        }

        function isPromise(object) {
            return isObject(object) && "function" == typeof object.promiseDispatch && "function" == typeof object.inspect
        }

        function isPromiseAlike(object) {
            return isObject(object) && "function" == typeof object.then
        }

        function isPending(object) {
            return isPromise(object) && "pending" === object.inspect().state
        }

        function isFulfilled(object) {
            return !isPromise(object) || "fulfilled" === object.inspect().state
        }

        function isRejected(object) {
            return isPromise(object) && "rejected" === object.inspect().state
        }

        function resetUnhandledRejections() {
            unhandledReasons.length = 0, unhandledRejections.length = 0, trackUnhandledRejections || (trackUnhandledRejections = !0)
        }

        function trackRejection(promise, reason) {
            trackUnhandledRejections && (unhandledRejections.push(promise), unhandledReasons.push(reason && "undefined" != typeof reason.stack ? reason.stack : "(no stack) " + reason))
        }

        function untrackRejection(promise) {
            if (trackUnhandledRejections) {
                var at = array_indexOf(unhandledRejections, promise); - 1 !== at && (unhandledRejections.splice(at, 1), unhandledReasons.splice(at, 1))
            }
        }

        function reject(reason) {
            var rejection = Promise({
                when: function(rejected) {
                    return rejected && untrackRejection(this), rejected ? rejected(reason) : this
                }
            }, function() {
                return this
            }, function() {
                return {
                    state: "rejected",
                    reason: reason
                }
            });
            return trackRejection(rejection, reason), rejection
        }

        function fulfill(value) {
            return Promise({
                when: function() {
                    return value
                },
                get: function(name) {
                    return value[name]
                },
                set: function(name, rhs) {
                    value[name] = rhs
                },
                "delete": function(name) {
                    delete value[name]
                },
                post: function(name, args) {
                    return null === name || void 0 === name ? value.apply(void 0, args) : value[name].apply(value, args)
                },
                apply: function(thisp, args) {
                    return value.apply(thisp, args)
                },
                keys: function() {
                    return object_keys(value)
                }
            }, void 0, function() {
                return {
                    state: "fulfilled",
                    value: value
                }
            })
        }

        function coerce(promise) {
            var deferred = defer();
            return nextTick(function() {
                try {
                    promise.then(deferred.resolve, deferred.reject, deferred.notify)
                } catch (exception) {
                    deferred.reject(exception)
                }
            }), deferred.promise
        }

        function master(object) {
            return Promise({
                isDef: function() {}
            }, function(op, args) {
                return dispatch(object, op, args)
            }, function() {
                return Q(object).inspect()
            })
        }

        function spread(value, fulfilled, rejected) {
            return Q(value).spread(fulfilled, rejected)
        }

        function async(makeGenerator) {
            return function() {
                function continuer(verb, arg) {
                    var result;
                    if ("undefined" == typeof StopIteration) {
                        try {
                            result = generator[verb](arg)
                        } catch (exception) {
                            return reject(exception)
                        }
                        return result.done ? result.value : when(result.value, callback, errback)
                    }
                    try {
                        result = generator[verb](arg)
                    } catch (exception) {
                        return isStopIteration(exception) ? exception.value : reject(exception)
                    }
                    return when(result, callback, errback)
                }
                var generator = makeGenerator.apply(this, arguments),
                    callback = continuer.bind(continuer, "next"),
                    errback = continuer.bind(continuer, "throw");
                return callback()
            }
        }

        function spawn(makeGenerator) {
            Q.done(Q.async(makeGenerator)())
        }

        function _return(value) {
            throw new QReturnValue(value)
        }

        function promised(callback) {
            return function() {
                return spread([this, all(arguments)], function(self, args) {
                    return callback.apply(self, args)
                })
            }
        }

        function dispatch(object, op, args) {
            return Q(object).dispatch(op, args)
        }

        function all(promises) {
            return when(promises, function(promises) {
                var countDown = 0,
                    deferred = defer();
                return array_reduce(promises, function(undefined, promise, index) {
                    var snapshot;
                    isPromise(promise) && "fulfilled" === (snapshot = promise.inspect()).state ? promises[index] = snapshot.value : (++countDown, when(promise, function(value) {
                        promises[index] = value, 0 === --countDown && deferred.resolve(promises)
                    }, deferred.reject, function(progress) {
                        deferred.notify({
                            index: index,
                            value: progress
                        })
                    }))
                }, void 0), 0 === countDown && deferred.resolve(promises), deferred.promise
            })
        }

        function allResolved(promises) {
            return when(promises, function(promises) {
                return promises = array_map(promises, Q), when(all(array_map(promises, function(promise) {
                    return when(promise, noop, noop)
                })), function() {
                    return promises
                })
            })
        }

        function allSettled(promises) {
            return Q(promises).allSettled()
        }

        function progress(object, progressed) {
            return Q(object).then(void 0, void 0, progressed)
        }

        function nodeify(object, nodeback) {
            return Q(object).nodeify(nodeback)
        }
        var hasStacks = !1;
        try {
            throw new Error
        } catch (e) {
            hasStacks = !!e.stack
        }
        var qFileName, QReturnValue, qStartingLine = captureLine(),
            noop = function() {},
            nextTick = function() {
                function flush() {
                    for (; head.next;) {
                        head = head.next;
                        var task = head.task;
                        head.task = void 0;
                        var domain = head.domain;
                        domain && (head.domain = void 0, domain.enter());
                        try {
                            task()
                        } catch (e) {
                            if (isNodeJS) throw domain && domain.exit(), setTimeout(flush, 0), domain && domain.enter(), e;
                            setTimeout(function() {
                                throw e
                            }, 0)
                        }
                        domain && domain.exit()
                    }
                    flushing = !1
                }
                var head = {
                        task: void 0,
                        next: null
                    },
                    tail = head,
                    flushing = !1,
                    requestTick = void 0,
                    isNodeJS = !1;
                if (nextTick = function(task) {
                    tail = tail.next = {
                        task: task,
                        domain: isNodeJS && process.domain,
                        next: null
                    }, flushing || (flushing = !0, requestTick())
                }, "undefined" != typeof process && process.nextTick) isNodeJS = !0, requestTick = function() {
                    process.nextTick(flush)
                };
                else if ("function" == typeof setImmediate) requestTick = "undefined" != typeof window ? setImmediate.bind(window, flush) : function() {
                    setImmediate(flush)
                };
                else if ("undefined" != typeof MessageChannel) {
                    var channel = new MessageChannel;
                    channel.port1.onmessage = function() {
                        requestTick = requestPortTick, channel.port1.onmessage = flush, flush()
                    };
                    var requestPortTick = function() {
                        channel.port2.postMessage(0)
                    };
                    requestTick = function() {
                        setTimeout(flush, 0), requestPortTick()
                    }
                } else requestTick = function() {
                    setTimeout(flush, 0)
                };
                return nextTick
            }(),
            call = Function.call,
            array_slice = uncurryThis(Array.prototype.slice),
            array_reduce = uncurryThis(Array.prototype.reduce || function(callback, basis) {
                var index = 0,
                    length = this.length;
                if (1 === arguments.length)
                    for (;;) {
                        if (index in this) {
                            basis = this[index++];
                            break
                        }
                        if (++index >= length) throw new TypeError
                    }
                for (; length > index; index++) index in this && (basis = callback(basis, this[index], index));
                return basis
            }),
            array_indexOf = uncurryThis(Array.prototype.indexOf || function(value) {
                for (var i = 0; i < this.length; i++)
                    if (this[i] === value) return i;
                return -1
            }),
            array_map = uncurryThis(Array.prototype.map || function(callback, thisp) {
                var self = this,
                    collect = [];
                return array_reduce(self, function(undefined, value, index) {
                    collect.push(callback.call(thisp, value, index, self))
                }, void 0), collect
            }),
            object_create = Object.create || function(prototype) {
                function Type() {}
                return Type.prototype = prototype, new Type
            },
            object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty),
            object_keys = Object.keys || function(object) {
                var keys = [];
                for (var key in object) object_hasOwnProperty(object, key) && keys.push(key);
                return keys
            },
            object_toString = uncurryThis(Object.prototype.toString);
        QReturnValue = "undefined" != typeof ReturnValue ? ReturnValue : function(value) {
            this.value = value
        };
        var STACK_JUMP_SEPARATOR = "From previous event:";
        Q.resolve = Q, Q.nextTick = nextTick, Q.longStackSupport = !1, Q.defer = defer, defer.prototype.makeNodeResolver = function() {
            var self = this;
            return function(error, value) {
                error ? self.reject(error) : self.resolve(arguments.length > 2 ? array_slice(arguments, 1) : value)
            }
        }, Q.Promise = promise, Q.promise = promise, promise.race = race, promise.all = all, promise.reject = reject, promise.resolve = Q, Q.passByCopy = function(object) {
            return object
        }, Promise.prototype.passByCopy = function() {
            return this
        }, Q.join = function(x, y) {
            return Q(x).join(y)
        }, Promise.prototype.join = function(that) {
            return Q([this, that]).spread(function(x, y) {
                if (x === y) return x;
                throw new Error("Can't join: not the same: " + x + " " + y)
            })
        }, Q.race = race, Promise.prototype.race = function() {
            return this.then(Q.race)
        }, Q.makePromise = Promise, Promise.prototype.toString = function() {
            return "[object Promise]"
        }, Promise.prototype.then = function(fulfilled, rejected, progressed) {
            function _fulfilled(value) {
                try {
                    return "function" == typeof fulfilled ? fulfilled(value) : value
                } catch (exception) {
                    return reject(exception)
                }
            }

            function _rejected(exception) {
                if ("function" == typeof rejected) {
                    makeStackTraceLong(exception, self);
                    try {
                        return rejected(exception)
                    } catch (newException) {
                        return reject(newException)
                    }
                }
                return reject(exception)
            }

            function _progressed(value) {
                return "function" == typeof progressed ? progressed(value) : value
            }
            var self = this,
                deferred = defer(),
                done = !1;
            return nextTick(function() {
                self.promiseDispatch(function(value) {
                    done || (done = !0, deferred.resolve(_fulfilled(value)))
                }, "when", [
                    function(exception) {
                        done || (done = !0, deferred.resolve(_rejected(exception)))
                    }
                ])
            }), self.promiseDispatch(void 0, "when", [void 0,
                function(value) {
                    var newValue, threw = !1;
                    try {
                        newValue = _progressed(value)
                    } catch (e) {
                        if (threw = !0, !Q.onerror) throw e;
                        Q.onerror(e)
                    }
                    threw || deferred.notify(newValue)
                }
            ]), deferred.promise
        }, Q.when = when, Promise.prototype.thenResolve = function(value) {
            return this.then(function() {
                return value
            })
        }, Q.thenResolve = function(promise, value) {
            return Q(promise).thenResolve(value)
        }, Promise.prototype.thenReject = function(reason) {
            return this.then(function() {
                throw reason
            })
        }, Q.thenReject = function(promise, reason) {
            return Q(promise).thenReject(reason)
        }, Q.nearer = nearer, Q.isPromise = isPromise, Q.isPromiseAlike = isPromiseAlike, Q.isPending = isPending, Promise.prototype.isPending = function() {
            return "pending" === this.inspect().state
        }, Q.isFulfilled = isFulfilled, Promise.prototype.isFulfilled = function() {
            return "fulfilled" === this.inspect().state
        }, Q.isRejected = isRejected, Promise.prototype.isRejected = function() {
            return "rejected" === this.inspect().state
        };
        var unhandledReasons = [],
            unhandledRejections = [],
            trackUnhandledRejections = !0;
        Q.resetUnhandledRejections = resetUnhandledRejections, Q.getUnhandledReasons = function() {
            return unhandledReasons.slice()
        }, Q.stopUnhandledRejectionTracking = function() {
            resetUnhandledRejections(), trackUnhandledRejections = !1
        }, resetUnhandledRejections(), Q.reject = reject, Q.fulfill = fulfill, Q.master = master, Q.spread = spread, Promise.prototype.spread = function(fulfilled, rejected) {
            return this.all().then(function(array) {
                return fulfilled.apply(void 0, array)
            }, rejected)
        }, Q.async = async, Q.spawn = spawn, Q["return"] = _return, Q.promised = promised, Q.dispatch = dispatch, Promise.prototype.dispatch = function(op, args) {
            var self = this,
                deferred = defer();
            return nextTick(function() {
                self.promiseDispatch(deferred.resolve, op, args)
            }), deferred.promise
        }, Q.get = function(object, key) {
            return Q(object).dispatch("get", [key])
        }, Promise.prototype.get = function(key) {
            return this.dispatch("get", [key])
        }, Q.set = function(object, key, value) {
            return Q(object).dispatch("set", [key, value])
        }, Promise.prototype.set = function(key, value) {
            return this.dispatch("set", [key, value])
        }, Q.del = Q["delete"] = function(object, key) {
            return Q(object).dispatch("delete", [key])
        }, Promise.prototype.del = Promise.prototype["delete"] = function(key) {
            return this.dispatch("delete", [key])
        }, Q.mapply = Q.post = function(object, name, args) {
            return Q(object).dispatch("post", [name, args])
        }, Promise.prototype.mapply = Promise.prototype.post = function(name, args) {
            return this.dispatch("post", [name, args])
        }, Q.send = Q.mcall = Q.invoke = function(object, name) {
            return Q(object).dispatch("post", [name, array_slice(arguments, 2)])
        }, Promise.prototype.send = Promise.prototype.mcall = Promise.prototype.invoke = function(name) {
            return this.dispatch("post", [name, array_slice(arguments, 1)])
        }, Q.fapply = function(object, args) {
            return Q(object).dispatch("apply", [void 0, args])
        }, Promise.prototype.fapply = function(args) {
            return this.dispatch("apply", [void 0, args])
        }, Q["try"] = Q.fcall = function(object) {
            return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)])
        }, Promise.prototype.fcall = function() {
            return this.dispatch("apply", [void 0, array_slice(arguments)])
        }, Q.fbind = function(object) {
            var promise = Q(object),
                args = array_slice(arguments, 1);
            return function() {
                return promise.dispatch("apply", [this, args.concat(array_slice(arguments))])
            }
        }, Promise.prototype.fbind = function() {
            var promise = this,
                args = array_slice(arguments);
            return function() {
                return promise.dispatch("apply", [this, args.concat(array_slice(arguments))])
            }
        }, Q.keys = function(object) {
            return Q(object).dispatch("keys", [])
        }, Promise.prototype.keys = function() {
            return this.dispatch("keys", [])
        }, Q.all = all, Promise.prototype.all = function() {
            return all(this)
        }, Q.allResolved = deprecate(allResolved, "allResolved", "allSettled"), Promise.prototype.allResolved = function() {
            return allResolved(this)
        }, Q.allSettled = allSettled, Promise.prototype.allSettled = function() {
            return this.then(function(promises) {
                return all(array_map(promises, function(promise) {
                    function regardless() {
                        return promise.inspect()
                    }
                    return promise = Q(promise), promise.then(regardless, regardless)
                }))
            })
        }, Q.fail = Q["catch"] = function(object, rejected) {
            return Q(object).then(void 0, rejected)
        }, Promise.prototype.fail = Promise.prototype["catch"] = function(rejected) {
            return this.then(void 0, rejected)
        }, Q.progress = progress, Promise.prototype.progress = function(progressed) {
            return this.then(void 0, void 0, progressed)
        }, Q.fin = Q["finally"] = function(object, callback) {
            return Q(object)["finally"](callback)
        }, Promise.prototype.fin = Promise.prototype["finally"] = function(callback) {
            return callback = Q(callback), this.then(function(value) {
                return callback.fcall().then(function() {
                    return value
                })
            }, function(reason) {
                return callback.fcall().then(function() {
                    throw reason
                })
            })
        }, Q.done = function(object, fulfilled, rejected, progress) {
            return Q(object).done(fulfilled, rejected, progress)
        }, Promise.prototype.done = function(fulfilled, rejected, progress) {
            var onUnhandledError = function(error) {
                    nextTick(function() {
                        if (makeStackTraceLong(error, promise), !Q.onerror) throw error;
                        Q.onerror(error)
                    })
                },
                promise = fulfilled || rejected || progress ? this.then(fulfilled, rejected, progress) : this;
            "object" == typeof process && process && process.domain && (onUnhandledError = process.domain.bind(onUnhandledError)), promise.then(void 0, onUnhandledError)
        }, Q.timeout = function(object, ms, message) {
            return Q(object).timeout(ms, message)
        }, Promise.prototype.timeout = function(ms, message) {
            var deferred = defer(),
                timeoutId = setTimeout(function() {
                    deferred.reject(new Error(message || "Timed out after " + ms + " ms"))
                }, ms);
            return this.then(function(value) {
                clearTimeout(timeoutId), deferred.resolve(value)
            }, function(exception) {
                clearTimeout(timeoutId), deferred.reject(exception)
            }, deferred.notify), deferred.promise
        }, Q.delay = function(object, timeout) {
            return void 0 === timeout && (timeout = object, object = void 0), Q(object).delay(timeout)
        }, Promise.prototype.delay = function(timeout) {
            return this.then(function(value) {
                var deferred = defer();
                return setTimeout(function() {
                    deferred.resolve(value)
                }, timeout), deferred.promise
            })
        }, Q.nfapply = function(callback, args) {
            return Q(callback).nfapply(args)
        }, Promise.prototype.nfapply = function(args) {
            var deferred = defer(),
                nodeArgs = array_slice(args);
            return nodeArgs.push(deferred.makeNodeResolver()), this.fapply(nodeArgs).fail(deferred.reject), deferred.promise
        }, Q.nfcall = function(callback) {
            var args = array_slice(arguments, 1);
            return Q(callback).nfapply(args)
        }, Promise.prototype.nfcall = function() {
            var nodeArgs = array_slice(arguments),
                deferred = defer();
            return nodeArgs.push(deferred.makeNodeResolver()), this.fapply(nodeArgs).fail(deferred.reject), deferred.promise
        }, Q.nfbind = Q.denodeify = function(callback) {
            var baseArgs = array_slice(arguments, 1);
            return function() {
                var nodeArgs = baseArgs.concat(array_slice(arguments)),
                    deferred = defer();
                return nodeArgs.push(deferred.makeNodeResolver()), Q(callback).fapply(nodeArgs).fail(deferred.reject), deferred.promise
            }
        }, Promise.prototype.nfbind = Promise.prototype.denodeify = function() {
            var args = array_slice(arguments);
            return args.unshift(this), Q.denodeify.apply(void 0, args)
        }, Q.nbind = function(callback, thisp) {
            var baseArgs = array_slice(arguments, 2);
            return function() {
                function bound() {
                    return callback.apply(thisp, arguments)
                }
                var nodeArgs = baseArgs.concat(array_slice(arguments)),
                    deferred = defer();
                return nodeArgs.push(deferred.makeNodeResolver()), Q(bound).fapply(nodeArgs).fail(deferred.reject), deferred.promise
            }
        }, Promise.prototype.nbind = function() {
            var args = array_slice(arguments, 0);
            return args.unshift(this), Q.nbind.apply(void 0, args)
        }, Q.nmapply = Q.npost = function(object, name, args) {
            return Q(object).npost(name, args)
        }, Promise.prototype.nmapply = Promise.prototype.npost = function(name, args) {
            var nodeArgs = array_slice(args || []),
                deferred = defer();
            return nodeArgs.push(deferred.makeNodeResolver()), this.dispatch("post", [name, nodeArgs]).fail(deferred.reject), deferred.promise
        }, Q.nsend = Q.nmcall = Q.ninvoke = function(object, name) {
            var nodeArgs = array_slice(arguments, 2),
                deferred = defer();
            return nodeArgs.push(deferred.makeNodeResolver()), Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject), deferred.promise
        }, Promise.prototype.nsend = Promise.prototype.nmcall = Promise.prototype.ninvoke = function(name) {
            var nodeArgs = array_slice(arguments, 1),
                deferred = defer();
            return nodeArgs.push(deferred.makeNodeResolver()), this.dispatch("post", [name, nodeArgs]).fail(deferred.reject), deferred.promise
        }, Q.nodeify = nodeify, Promise.prototype.nodeify = function(nodeback) {
            return nodeback ? void this.then(function(value) {
                nextTick(function() {
                    nodeback(null, value)
                })
            }, function(error) {
                nextTick(function() {
                    nodeback(error)
                })
            }) : this
        };
        var qEndingLine = captureLine();
        return Q
    }),
    function(global, undefined) {
        "use strict";
        var Alertify, document = global.document;
        Alertify = function() {
            var $, btnCancel, btnOK, btnReset, btnFocus, elCallee, elCover, elDialog, elLog, form, input, getTransitionEvent, _alertify = {},
                dialogs = {},
                isopen = !1,
                keys = {
                    ENTER: 13,
                    ESC: 27,
                    SPACE: 32
                },
                queue = [];
            return dialogs = {
                buttons: {
                    holder: '<nav class="alertify-buttons">{{buttons}}</nav>',
                    submit: '<button type="submit" class="alertify-button alertify-button-ok" id="alertify-ok">{{ok}}</button>',
                    ok: '<button class="alertify-button alertify-button-ok" id="alertify-ok">{{ok}}</button>',
                    cancel: '<button class="alertify-button alertify-button-cancel" id="alertify-cancel">{{cancel}}</button>'
                },
                input: '<div class="alertify-text-wrapper"><input type="text" class="alertify-text" id="alertify-text"></div>',
                message: '<p class="alertify-message">{{message}}</p>',
                log: '<article class="alertify-log{{class}}">{{message}}</article>'
            }, getTransitionEvent = function() {
                var t, type, supported = !1,
                    el = document.createElement("fakeelement"),
                    transitions = {
                        WebkitTransition: "webkitTransitionEnd",
                        MozTransition: "transitionend",
                        OTransition: "otransitionend",
                        transition: "transitionend"
                    };
                for (t in transitions)
                    if (el.style[t] !== undefined) {
                        type = transitions[t], supported = !0;
                        break
                    }
                return {
                    type: type,
                    supported: supported
                }
            }, $ = function(id) {
                return document.getElementById(id)
            }, _alertify = {
                labels: {
                    ok: "OK",
                    cancel: "Cancel"
                },
                delay: 5e3,
                buttonReverse: !1,
                buttonFocus: "ok",
                transition: undefined,
                addListeners: function(fn) {
                    var ok, cancel, common, key, reset, hasOK = "undefined" != typeof btnOK,
                        hasCancel = "undefined" != typeof btnCancel,
                        hasInput = "undefined" != typeof input,
                        val = "",
                        self = this;
                    ok = function(event) {
                        return "undefined" != typeof event.preventDefault && event.preventDefault(), common(event), "undefined" != typeof input && (val = input.value), "function" == typeof fn && ("undefined" != typeof input ? fn(!0, val) : fn(!0)), !1
                    }, cancel = function(event) {
                        return "undefined" != typeof event.preventDefault && event.preventDefault(), common(event), "function" == typeof fn && fn(!1), !1
                    }, common = function() {
                        self.hide(), self.unbind(document.body, "keyup", key), self.unbind(btnReset, "focus", reset), hasInput && self.unbind(form, "submit", ok), hasOK && self.unbind(btnOK, "click", ok), hasCancel && self.unbind(btnCancel, "click", cancel)
                    }, key = function(event) {
                        var keyCode = event.keyCode;
                        keyCode !== keys.SPACE || hasInput || ok(event), keyCode === keys.ESC && hasCancel && cancel(event)
                    }, reset = function() {
                        hasInput ? input.focus() : !hasCancel || self.buttonReverse ? btnOK.focus() : btnCancel.focus()
                    }, this.bind(btnReset, "focus", reset), hasOK && this.bind(btnOK, "click", ok), hasCancel && this.bind(btnCancel, "click", cancel), this.bind(document.body, "keyup", key), hasInput && this.bind(form, "submit", ok), this.transition.supported || this.setFocus()
                },
                bind: function(el, event, fn) {
                    "function" == typeof el.addEventListener ? el.addEventListener(event, fn, !1) : el.attachEvent && el.attachEvent("on" + event, fn)
                },
                handleErrors: function() {
                    if ("undefined" != typeof global.onerror) {
                        var self = this;
                        return global.onerror = function(msg, url, line) {
                            self.error("[" + msg + " on line " + line + " of " + url + "]", 0)
                        }, !0
                    }
                    return !1
                },
                appendButtons: function(secondary, primary) {
                    return this.buttonReverse ? primary + secondary : secondary + primary
                },
                build: function(item) {
                    var html = "",
                        type = item.type,
                        message = item.message,
                        css = item.cssClass || "";
                    switch (html += '<div class="alertify-dialog">', "none" === _alertify.buttonFocus && (html += '<a href="#" id="alertify-noneFocus" class="alertify-hidden"></a>'), "prompt" === type && (html += '<form id="alertify-form">'), html += '<article class="alertify-inner">', html += dialogs.message.replace("{{message}}", message), "prompt" === type && (html += dialogs.input), html += dialogs.buttons.holder, html += "</article>", "prompt" === type && (html += "</form>"), html += '<a id="alertify-resetFocus" class="alertify-resetFocus" href="#">Reset Focus</a>', html += "</div>", type) {
                        case "confirm":
                            html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.ok)), html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
                            break;
                        case "prompt":
                            html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.submit)), html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
                            break;
                        case "alert":
                            html = html.replace("{{buttons}}", dialogs.buttons.ok), html = html.replace("{{ok}}", this.labels.ok)
                    }
                    return elDialog.className = "alertify alertify-" + type + " " + css, elCover.className = "alertify-cover", html
                },
                close: function(elem, wait) {
                    var hideElement, transitionDone, timer = wait && !isNaN(wait) ? +wait : this.delay,
                        self = this;
                    this.bind(elem, "click", function() {
                        hideElement(elem)
                    }), transitionDone = function(event) {
                        event.stopPropagation(), self.unbind(this, self.transition.type, transitionDone), elLog.removeChild(this), elLog.hasChildNodes() || (elLog.className += " alertify-logs-hidden")
                    }, hideElement = function(el) {
                        "undefined" != typeof el && el.parentNode === elLog && (self.transition.supported ? (self.bind(el, self.transition.type, transitionDone), el.className += " alertify-log-hide") : (elLog.removeChild(el), elLog.hasChildNodes() || (elLog.className += " alertify-logs-hidden")))
                    }, 0 !== wait && setTimeout(function() {
                        hideElement(elem)
                    }, timer)
                },
                dialog: function(message, type, fn, placeholder, cssClass) {
                    elCallee = document.activeElement;
                    var check = function() {
                        elLog && null !== elLog.scrollTop && elCover && null !== elCover.scrollTop || check()
                    };
                    if ("string" != typeof message) throw new Error("message must be a string");
                    if ("string" != typeof type) throw new Error("type must be a string");
                    if ("undefined" != typeof fn && "function" != typeof fn) throw new Error("fn must be a function");
                    return "function" == typeof this.init && (this.init(), check()), queue.push({
                        type: type,
                        message: message,
                        callback: fn,
                        placeholder: placeholder,
                        cssClass: cssClass
                    }), isopen || this.setup(), this
                },
                extend: function(type) {
                    if ("string" != typeof type) throw new Error("extend method must have exactly one paramter");
                    return function(message, wait) {
                        return this.log(message, type, wait), this
                    }
                },
                hide: function() {
                    var transitionDone, self = this;
                    queue.splice(0, 1), queue.length > 0 ? this.setup(!0) : (isopen = !1, transitionDone = function(event) {
                        event.stopPropagation(), elDialog.className += " alertify-isHidden", self.unbind(elDialog, self.transition.type, transitionDone)
                    }, this.transition.supported ? (this.bind(elDialog, this.transition.type, transitionDone), elDialog.className = "alertify alertify-hide alertify-hidden") : elDialog.className = "alertify alertify-hide alertify-hidden alertify-isHidden", elCover.className = "alertify-cover alertify-cover-hidden", elCallee.focus())
                },
                init: function() {
                    document.createElement("nav"), document.createElement("article"), document.createElement("section"), elCover = document.createElement("div"), elCover.setAttribute("id", "alertify-cover"), elCover.className = "alertify-cover alertify-cover-hidden", document.body.appendChild(elCover), elDialog = document.createElement("section"), elDialog.setAttribute("id", "alertify"), elDialog.className = "alertify alertify-hidden", document.body.appendChild(elDialog), elLog = document.createElement("section"), elLog.setAttribute("id", "alertify-logs"), elLog.className = "alertify-logs alertify-logs-hidden", document.body.appendChild(elLog), document.body.setAttribute("tabindex", "0"), this.transition = getTransitionEvent(), delete this.init
                },
                log: function(message, type, wait) {
                    var check = function() {
                        elLog && null !== elLog.scrollTop || check()
                    };
                    return "function" == typeof this.init && (this.init(), check()), elLog.className = "alertify-logs", this.notify(message, type, wait), this
                },
                notify: function(message, type, wait) {
                    var log = document.createElement("article");
                    log.className = "alertify-log" + ("string" == typeof type && "" !== type ? " alertify-log-" + type : ""), log.innerHTML = message, elLog.appendChild(log), setTimeout(function() {
                        log.className = log.className + " alertify-log-show"
                    }, 50), this.close(log, wait)
                },
                set: function(args) {
                    var k;
                    if ("object" != typeof args && args instanceof Array) throw new Error("args must be an object");
                    for (k in args) args.hasOwnProperty(k) && (this[k] = args[k])
                },
                setFocus: function() {
                    input ? (input.focus(), input.select()) : btnFocus.focus()
                },
                setup: function(fromQueue) {
                    var transitionDone, item = queue[0],
                        self = this;
                    isopen = !0, transitionDone = function(event) {
                        event.stopPropagation(), self.setFocus(), self.unbind(elDialog, self.transition.type, transitionDone)
                    }, this.transition.supported && !fromQueue && this.bind(elDialog, this.transition.type, transitionDone), elDialog.innerHTML = this.build(item), btnReset = $("alertify-resetFocus"), btnOK = $("alertify-ok") || undefined, btnCancel = $("alertify-cancel") || undefined, btnFocus = "cancel" === _alertify.buttonFocus ? btnCancel : "none" === _alertify.buttonFocus ? $("alertify-noneFocus") : btnOK, input = $("alertify-text") || undefined, form = $("alertify-form") || undefined, "string" == typeof item.placeholder && "" !== item.placeholder && (input.value = item.placeholder), fromQueue && this.setFocus(), this.addListeners(item.callback)
                },
                unbind: function(el, event, fn) {
                    "function" == typeof el.removeEventListener ? el.removeEventListener(event, fn, !1) : el.detachEvent && el.detachEvent("on" + event, fn)
                }
            }, {
                alert: function(message, fn, cssClass) {
                    return _alertify.dialog(message, "alert", fn, "", cssClass), this
                },
                confirm: function(message, fn, cssClass) {
                    return _alertify.dialog(message, "confirm", fn, "", cssClass), this
                },
                extend: _alertify.extend,
                init: _alertify.init,
                log: function(message, type, wait) {
                    return _alertify.log(message, type, wait), this
                },
                prompt: function(message, fn, placeholder, cssClass) {
                    return _alertify.dialog(message, "prompt", fn, placeholder, cssClass), this
                },
                success: function(message, wait) {
                    return _alertify.log(message, "success", wait), this
                },
                error: function(message, wait) {
                    return _alertify.log(message, "error", wait), this
                },
                set: function(args) {
                    _alertify.set(args)
                },
                labels: _alertify.labels,
                debug: _alertify.handleErrors
            }
        }, "undefined" == typeof global.CwmnAlertify && (global.CwmnAlertify = new Alertify)
    }(this), ! function(name, context, definition) {
        "undefined" != typeof module && module.exports ? module.exports = definition() : context[name] = definition()
    }("CwmnReqwest", this, function() {
        function succeed(request) {
            return httpsRe.test(window.location.protocol) ? twoHundo.test(request.status) : !!request.response
        }

        function handleReadyState(r, success, error) {
        	console.log(r);
        	console.log(success);
        	console.log(error);
            return function() {
                return r._aborted ? error(r.request) : void(r.request && 4 == r.request[readyState] && (r.request.onreadystatechange = noop, succeed(r.request) ? success(r.request) : error(r.request)))
            }
        }

        function setHeaders(http, o) {
            var h, headers = o.headers || {};
            headers.Accept = headers.Accept || defaultHeaders.accept[o.type] || defaultHeaders.accept["*"];
            var isAFormData = "function" == typeof FormData && o.data instanceof FormData;
            o.crossOrigin || headers[requestedWith] || (headers[requestedWith] = defaultHeaders.requestedWith), headers[contentType] || isAFormData || (headers[contentType] = o.contentType || defaultHeaders.contentType);
            for (h in headers) headers.hasOwnProperty(h) && "setRequestHeader" in http && http.setRequestHeader(h, headers[h])
        }

        function setCredentials(http, o) {
            "undefined" != typeof o.withCredentials && "undefined" != typeof http.withCredentials && (http.withCredentials = !!o.withCredentials)
        }

        function generalCallback(data) {
            lastValue = data
        }

        function urlappend(url, s) {
            return url + (/\?/.test(url) ? "&" : "?") + s
        }

        function handleJsonp(o, fn, err, url) {
        	console.debug("handleJsonp");
        	console.log(o);
        	console.log(fn);
        	console.log(err);
        	console.log(url);
            var reqId = uniqid++,
                cbkey = o.jsonpCallback || "callback",
                cbval = o.jsonpCallbackName || reqwest.getcallbackPrefix(reqId),
                cbreg = new RegExp("((^|\\?|&)" + cbkey + ")=([^&]+)"),
                match = url.match(cbreg),
                script = doc.createElement("script"),
                loaded = 0,
                isIE10 = -1 !== navigator.userAgent.indexOf("MSIE 10.0");

            return match ? "?" === match[3] ? url = url.replace(cbreg, "$1=" + cbval) : cbval = match[3] : url = urlappend(url, cbkey + "=" + cbval), win[cbval] = generalCallback, script.type = "text/javascript", script.src = url, script.async = !0, "undefined" == typeof script.onreadystatechange || isIE10 || (script.htmlFor = script.id = "_reqwest_" + reqId), script.onload = script.onreadystatechange = function() {
                return script[readyState] && "complete" !== script[readyState] && "loaded" !== script[readyState] || loaded ? !1 : (script.onload = script.onreadystatechange = null, script.onclick && script.onclick(), console.log(lastValue), fn(lastValue), lastValue = void 0, head.removeChild(script), void(loaded = 1))
            }, $('head').append(script), {
                abort: function() {
                    script.onload = script.onreadystatechange = null, err({}, "Request is aborted: timeout", {}), lastValue = void 0, head.removeChild(script), loaded = 1
                }
            }


        }

        function getRequest(fn, err) {
        	console.debug("getRequest");
            var http, o = this.o,
                method = (o.method || "GET").toUpperCase(),
                url = "string" == typeof o ? o : o.url,
                data = o.processData !== !1 && o.data && "string" != typeof o.data ? reqwest.toQueryString(o.data) : o.data || null,
                sendWait = !1;
            console.log(http);
            console.log(o);
            console.log(method);
            console.log(url);
            console.log(data);
            console.log(sendWait);



            //return "jsonp" != o.type && "GET" != method || !data || (url = urlappend(url, data), data = null), "jsonp" == o.type ? handleJsonp(o, fn, err, url) : (http = o.xhr && o.xhr(o) || xhr(o), http.open(method, url, o.async === !1 ? !1 : !0), setHeaders(http, o), setCredentials(http, o), win[xDomainRequest] && http instanceof win[xDomainRequest] ? (http.onload = fn, http.onerror = err, http.onprogress = function() {}, sendWait = !0) : http.onreadystatechange = handleReadyState(this, fn, err), o.before && o.before(http), sendWait ? setTimeout(function() {
            //    http.send(data)
            //}, 200) : http.send(data), http)




            if ("jsonp" != o.type && "GET" != method || !data) {
            	url = urlappend(url, data);
            	data = null;
           	}
           	if ("jsonp" == o.type) {
           		console.debug("THIS SPOT 0");
           		handleJsonp(o, fn, err, url);
           	} else {
           		http = o.xhr && o.xhr(o) || xhr(o);
           		http.open(method, url, o.async === !1 ? !1 : !0);
           		setHeaders(http, o);
           		setCredentials(http, o);
           		if (win[xDomainRequest] && http instanceof win[xDomainRequest]){
           			console.debug("THIS SPOT 1");
           			http.onload = fn;
           			http.onerror = err;
           			http.onprogress = function() {};
           			sendWait = !0;
           		} else {
           			console.debug("THIS SPOT 2");
           			http.onreadystatechange = handleReadyState(this, fn, err);
           			o.before && o.before(http);
           			if (sendWait) {
           				console.debug("THIS SPOT 3");
           				setTimeout(function() {
			                http.send(data)
			            }, 200);
			        } else{
			        	console.debug("THIS SPOT 4");
			        	http.send(data);
			        	http;
			        }
			    }
           	}

            var x = "jsonp" != o.type && "GET" != method || !data || (url = urlappend(url, data), data = null);
            console.log(x);
            return x;
        }

        function Reqwest(o, fn) {
            this.o = o, this.fn = fn, init.apply(this, arguments)
        }

        function setType(header) {
            return header.match("json") ? "json" : header.match("javascript") ? "js" : header.match("text") ? "html" : header.match("xml") ? "xml" : void 0
        }

        function init(o, fn) {
        	console.log(o);
        	console.log(fn);
            function complete(resp) {
            	console.log(resp);
                for (o.timeout && clearTimeout(self.timeout), self.timeout = null; self._completeHandlers.length > 0;) self._completeHandlers.shift()(resp)
            }

            function success(resp) {
            	console.log(resp);
                //var type = o.type || setType(resp.getResponseHeader("Content-Type"));
                var type = o.type || "text/javascript; charset=utf-8";
                //resp = "jsonp" !== type ? self.request : resp;
                resp = self.request;
                var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type),
                    r = filteredResponse;
                try {
                    resp.responseText = r
                } catch (e) {}
                if (r) switch (type) {
                    case "json":
                        try {
                            resp = win.JSON ? win.JSON.parse(r) : eval("(" + r + ")")
                        } catch (err) {
                            return error(resp, "Could not parse JSON in response", err)
                        }
                        break;
                    case "js":
                        resp = eval(r);
                        break;
                    case "html":
                        resp = r;
                        break;
                    case "xml":
                        resp = resp.responseXML && resp.responseXML.parseError && resp.responseXML.parseError.errorCode && resp.responseXML.parseError.reason ? null : resp.responseXML
                }
                for (self._responseArgs.resp = resp, self._fulfilled = !0, fn(resp), self._successHandler(resp); self._fulfillmentHandlers.length > 0;) resp = self._fulfillmentHandlers.shift()(resp);
                complete(resp)
            }

            function error(resp, msg, t) {
            	console.log(resp);
                for (resp = self.request, self._responseArgs.resp = resp, self._responseArgs.msg = msg, self._responseArgs.t = t, self._erred = !0; self._errorHandlers.length > 0;) self._errorHandlers.shift()(resp, msg, t);
                complete(resp)
            }


            this.url = "string" == typeof o ? o : o.url, this.timeout = null, this._fulfilled = !1, this._successHandler = function() {}, this._fulfillmentHandlers = [], this._errorHandlers = [], this._completeHandlers = [], this._erred = !1, this._responseArgs = {};
            console.debug("URL="+this.url);
            var self = this;
            fn = fn || function() {}, o.timeout && (this.timeout = setTimeout(function() {
                self.abort()
            }, o.timeout)), o.success && (this._successHandler = function() {
                o.success.apply(o, arguments)
            }), o.error && this._errorHandlers.push(function() {
                o.error.apply(o, arguments)
            }), o.complete && this._completeHandlers.push(function() {
                o.complete.apply(o, arguments)
            }), this.request = getRequest.call(this, success, error)

            console.log(this.request);
        }

        function reqwest(o, fn) {
            return new Reqwest(o, fn)
        }

        function normalize(s) {
            return s ? s.replace(/\r?\n/g, "\r\n") : ""
        }

        function serial(el, cb) {
            var ch, ra, val, i, n = el.name,
                t = el.tagName.toLowerCase(),
                optCb = function(o) {
                    o && !o.disabled && cb(n, normalize(o.attributes.value && o.attributes.value.specified ? o.value : o.text))
                };
            if (!el.disabled && n) switch (t) {
                case "input":
                    /reset|button|image|file/i.test(el.type) || (ch = /checkbox/i.test(el.type), ra = /radio/i.test(el.type), val = el.value, (!(ch || ra) || el.checked) && cb(n, normalize(ch && "" === val ? "on" : val)));
                    break;
                case "textarea":
                    cb(n, normalize(el.value));
                    break;
                case "select":
                    if ("select-one" === el.type.toLowerCase()) optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null);
                    else
                        for (i = 0; el.length && i < el.length; i++) el.options[i].selected && optCb(el.options[i])
            }
        }

        function eachFormElement() {
            var e, i, cb = this,
                serializeSubtags = function(e, tags) {
                    var i, j, fa;
                    for (i = 0; i < tags.length; i++)
                        for (fa = e[byTag](tags[i]), j = 0; j < fa.length; j++) serial(fa[j], cb)
                };
            for (i = 0; i < arguments.length; i++) e = arguments[i], /input|select|textarea/i.test(e.tagName) && serial(e, cb), serializeSubtags(e, ["input", "select", "textarea"])
        }

        function serializeQueryString() {
            return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
        }

        function serializeHash() {
            var hash = {};
            return eachFormElement.apply(function(name, value) {
                name in hash ? (hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]]), hash[name].push(value)) : hash[name] = value
            }, arguments), hash
        }

        function buildParams(prefix, obj, traditional, add) {
            var name, i, v, rbracket = /\[\]$/;
            if (isArray(obj))
                for (i = 0; obj && i < obj.length; i++) v = obj[i], traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add);
            else if (obj && "[object Object]" === obj.toString())
                for (name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            else add(prefix, obj)
        }
        var win = window,
            doc = document,
            httpsRe = /^http/,
            twoHundo = /^(20\d|1223)$/,
            byTag = "getElementsByTagName",
            readyState = "readyState",
            contentType = "Content-Type",
            requestedWith = "X-Requested-With",
            head = doc[byTag]("head")[0],
            uniqid = 0,
            callbackPrefix = "reqwest_" + +new Date,
            lastValue, xmlHttpRequest = "XMLHttpRequest",
            xDomainRequest = "XDomainRequest",
            noop = function() {},
            isArray = "function" == typeof Array.isArray ? Array.isArray : function(a) {
                return a instanceof Array
            },
            defaultHeaders = {
                contentType: "application/x-www-form-urlencoded",
                requestedWith: xmlHttpRequest,
                accept: {
                    "*": "text/javascript, text/html, application/xml, text/xml, */*",
                    xml: "application/xml, text/xml",
                    html: "text/html",
                    text: "text/plain",
                    json: "application/json, text/javascript",
                    js: "application/javascript, text/javascript"
                }
            },
            xhr = function(o) {
                if (o.crossOrigin === !0) {
                    var xhr = win[xmlHttpRequest] ? new XMLHttpRequest : null;
                    if (xhr && "withCredentials" in xhr) return xhr;
                    if (win[xDomainRequest]) return new XDomainRequest;
                    throw new Error("Browser does not support cross-origin requests")
                }
                return win[xmlHttpRequest] ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")
            },
            globalSetupOptions = {
                dataFilter: function(data) {
                    return data
                }
            };
        return Reqwest.prototype = {
            abort: function() {
                this._aborted = !0, this.request.abort()
            },
            retry: function() {
                init.call(this, this.o, this.fn)
            },
            then: function(success, fail) {
                return success = success || function() {}, fail = fail || function() {}, this._fulfilled ? this._responseArgs.resp = success(this._responseArgs.resp) : this._erred ? fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t) : (this._fulfillmentHandlers.push(success), this._errorHandlers.push(fail)), this
            },
            always: function(fn) {
                return this._fulfilled || this._erred ? fn(this._responseArgs.resp) : this._completeHandlers.push(fn), this
            },
            fail: function(fn) {
                return this._erred ? fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t) : this._errorHandlers.push(fn), this
            },
            "catch": function(fn) {
                return this.fail(fn)
            }
        }, reqwest.serializeArray = function() {
            var arr = [];
            return eachFormElement.apply(function(name, value) {
                arr.push({
                    name: name,
                    value: value
                })
            }, arguments), arr
        }, reqwest.serialize = function() {
            if (0 === arguments.length) return "";
            var opt, fn, args = Array.prototype.slice.call(arguments, 0);
            return opt = args.pop(), opt && opt.nodeType && args.push(opt) && (opt = null), opt && (opt = opt.type), fn = "map" == opt ? serializeHash : "array" == opt ? reqwest.serializeArray : serializeQueryString, fn.apply(null, args)
        }, reqwest.toQueryString = function(o, trad) {
            var prefix, i, traditional = trad || !1,
                s = [],
                enc = encodeURIComponent,
                add = function(key, value) {
                    value = "function" == typeof value ? value() : null == value ? "" : value, s[s.length] = enc(key) + "=" + enc(value)
                };
            if (isArray(o))
                for (i = 0; o && i < o.length; i++) add(o[i].name, o[i].value);
            else
                for (prefix in o) o.hasOwnProperty(prefix) && buildParams(prefix, o[prefix], traditional, add);
            return s.join("&").replace(/%20/g, "+")
        }, reqwest.getcallbackPrefix = function() {
            return callbackPrefix
        }, reqwest.compat = function(o, fn) {
            return o && (o.type && (o.method = o.type) && delete o.type, o.dataType && (o.type = o.dataType), o.jsonpCallback && (o.jsonpCallbackName = o.jsonpCallback) && delete o.jsonpCallback, o.jsonp && (o.jsonpCallback = o.jsonp)), new Reqwest(o, fn)
        }, reqwest.ajaxSetup = function(options) {
            options = options || {};
            for (var k in options) globalSetupOptions[k] = options[k]
        }, reqwest
    }),
    function(window, undefined) {
        "use strict";
        var EMPTY = "",
            UNKNOWN = "?",
            FUNC_TYPE = "function",
            UNDEF_TYPE = "undefined",
            OBJ_TYPE = "object",
            MAJOR = "major",
            MODEL = "model",
            NAME = "name",
            TYPE = "type",
            VENDOR = "vendor",
            VERSION = "version",
            ARCHITECTURE = "architecture",
            CONSOLE = "console",
            MOBILE = "mobile",
            TABLET = "tablet",
            SMARTTV = "smarttv",
            util = {
                has: function(str1, str2) {
                    return "string" == typeof str1 ? -1 !== str2.toLowerCase().indexOf(str1.toLowerCase()) : void 0
                },
                lowerize: function(str) {
                    return str.toLowerCase()
                }
            },
            mapper = {
                rgx: function() {
                    for (var result, j, k, p, q, matches, match, i = 0, args = arguments; i < args.length; i += 2) {
                        var regex = args[i],
                            props = args[i + 1];
                        if (typeof result === UNDEF_TYPE) {
                            result = {};
                            for (p in props) q = props[p], typeof q === OBJ_TYPE ? result[q[0]] = undefined : result[q] = undefined
                        }
                        for (j = k = 0; j < regex.length; j++)
                            if (matches = regex[j].exec(this.getUA())) {
                                for (p = 0; p < props.length; p++) match = matches[++k], q = props[p], typeof q === OBJ_TYPE && q.length > 0 ? 2 == q.length ? result[q[0]] = typeof q[1] == FUNC_TYPE ? q[1].call(this, match) : q[1] : 3 == q.length ? result[q[0]] = typeof q[1] !== FUNC_TYPE || q[1].exec && q[1].test ? match ? match.replace(q[1], q[2]) : undefined : match ? q[1].call(this, match, q[2]) : undefined : 4 == q.length && (result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined) : result[q] = match ? match : undefined;
                                break
                            }
                        if (matches) break
                    }
                    return result
                },
                str: function(str, map) {
                    for (var i in map)
                        if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                            for (var j = 0; j < map[i].length; j++)
                                if (util.has(map[i][j], str)) return i === UNKNOWN ? undefined : i
                        } else if (util.has(map[i], str)) return i === UNKNOWN ? undefined : i;
                    return str
                }
            },
            maps = {
                browser: {
                    oldsafari: {
                        major: {
                            1: ["/8", "/1", "/3"],
                            2: "/4",
                            "?": "/"
                        },
                        version: {
                            "1.0": "/8",
                            1.2: "/1",
                            1.3: "/3",
                            "2.0": "/412",
                            "2.0.2": "/416",
                            "2.0.3": "/417",
                            "2.0.4": "/419",
                            "?": "/"
                        }
                    }
                },
                device: {
                    sprint: {
                        model: {
                            "Evo Shift 4G": "7373KT"
                        },
                        vendor: {
                            HTC: "APA",
                            Sprint: "Sprint"
                        }
                    }
                },
                os: {
                    windows: {
                        version: {
                            ME: "4.90",
                            "NT 3.11": "NT3.51",
                            "NT 4.0": "NT4.0",
                            2000: "NT 5.0",
                            XP: ["NT 5.1", "NT 5.2"],
                            Vista: "NT 6.0",
                            7: "NT 6.1",
                            8: "NT 6.2",
                            8.1: "NT 6.3",
                            RT: "ARM"
                        }
                    }
                }
            },
            regexes = {
                browser: [
                    [/APP-([\w\s-\d]+)\/((\d+)?[\w\.]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(opera\smini)\/((\d+)?[\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/((\d+)?[\w\.-]+)/i, /(opera).+version\/((\d+)?[\w\.]+)/i, /(opera)[\/\s]+((\d+)?[\w\.]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/\s(opr)\/((\d+)?[\w\.]+)/i],
                    [
                        [NAME, "Opera"], VERSION, MAJOR
                    ],
                    [/(kindle)\/((\d+)?[\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?((\d+)?[\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?((\d+)?[\w\.]*)/i, /(?:ms|\()(ie)\s((\d+)?[\w\.]+)/i, /(rekonq)((?:\/)[\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron)\/((\d+)?[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(trident).+rv[:\s]((\d+)?[\w\.]+).+like\sgecko/i],
                    [
                        [NAME, "IE"], VERSION, MAJOR
                    ],
                    [/(yabrowser)\/((\d+)?[\w\.]+)/i],
                    [
                        [NAME, "Yandex"], VERSION, MAJOR
                    ],
                    [/(comodo_dragon)\/((\d+)?[\w\.]+)/i],
                    [
                        [NAME, /_/g, " "], VERSION, MAJOR
                    ],
                    [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?((\d+)?[\w\.]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(dolfin)\/((\d+)?[\w\.]+)/i],
                    [
                        [NAME, "Dolphin"], VERSION, MAJOR
                    ],
                    [/((?:android.+)crmo|crios)\/((\d+)?[\w\.]+)/i],
                    [
                        [NAME, "Chrome"], VERSION, MAJOR
                    ],
                    [/version\/((\d+)?[\w\.]+).+?mobile\/\w+\s(safari)/i],
                    [VERSION, MAJOR, [NAME, "Mobile Safari"]],
                    [/version\/((\d+)?[\w\.]+).+?(mobile\s?safari|safari)/i],
                    [VERSION, MAJOR, NAME],
                    [/webkit.+?(mobile\s?safari|safari)((\/[\w\.]+))/i],
                    [NAME, [MAJOR, mapper.str, maps.browser.oldsafari.major],
                        [VERSION, mapper.str, maps.browser.oldsafari.version]
                    ],
                    [/(konqueror)\/((\d+)?[\w\.]+)/i, /(webkit|khtml)\/((\d+)?[\w\.]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(navigator|netscape)\/((\d+)?[\w\.-]+)/i],
                    [
                        [NAME, "Netscape"], VERSION, MAJOR
                    ],
                    [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?((\d+)?[\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/((\d+)?[\w\.-]+)/i, /(mozilla)\/((\d+)?[\w\.]+).+rv\:.+gecko\/\d+/i, /(uc\s?browser|polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|qqbrowser)[\/\s]?((\d+)?[\w\.]+)/i, /(links)\s\(((\d+)?[\w\.]+)/i, /(gobrowser)\/?((\d+)?[\w\.]+)*/i, /(ice\s?browser)\/v?((\d+)?[\w\._]+)/i, /(mosaic)[\/\s]((\d+)?[\w\.]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(apple(?:coremedia|))\/((\d+)[\w\._]+)/i, /(coremedia) v((\d+)[\w\._]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i],
                    [NAME, VERSION],
                    [/(ares|ossproxy)\s((\d+)[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i, /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i, /(lg player|nexplayer)\s((\d+)[\d\.]+)/i, /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(nexplayer)\s((\d+)[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(flrp)\/((\d+)[\w\.-]+)/i],
                    [
                        [NAME, "Flip Player"], VERSION, MAJOR
                    ],
                    [/(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i],
                    [NAME],
                    [/(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i, /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i, /(lavf)((\d+)[\d\.]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(htc_one_s)\/((\d+)[\d\.]+)/i],
                    [
                        [NAME, /_/g, " "], VERSION, MAJOR
                    ],
                    [/(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i],
                    [NAME, VERSION],
                    [/(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(mplayer)/i, /(yourmuze)/i, /(media player classic|nero showtime)/i],
                    [NAME],
                    [/(nero (?:home|scout))\/((\d+)[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(nokia\d+)\/((\d+)[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/\s(songbird)\/((\d+)[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(winamp)3 version ((\d+)[\w\.-]+)/i, /(winamp)\s((\d+)[\w\.-]+)/i, /(winamp)mpeg\/((\d+)[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i],
                    [NAME],
                    [/(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(smp)((\d+)[\d\.]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(vlc) media player - version ((\d+)[\w\.]+)/i, /(vlc)\/((\d+)[\w\.-]+)/i, /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i, /(foobar2000)\/((\d+)[\d\.]+)/i, /(itunes)\/((\d+)[\d\.]+)/i],
                    [NAME, VERSION, MAJOR],
                    [/(wmplayer)\/((\d+)[\w\.-]+)/i, /(windows-media-player)\/((\d+)[\w\.-]+)/i],
                    [
                        [NAME, /-/g, " "], VERSION, MAJOR
                    ],
                    [/windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i],
                    [VERSION, MAJOR, [NAME, "Windows"]],
                    [/(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i],
                    [NAME, VERSION, MAJOR],
                    [/(rad.io)\s((\d+)[\d\.]+)/i, /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i],
                    [
                        [NAME, "rad.io"], VERSION, MAJOR
                    ]
                ],
                cpu: [
                    [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
                    [
                        [ARCHITECTURE, "amd64"]
                    ],
                    [/(ia32(?=;))/i],
                    [
                        [ARCHITECTURE, util.lowerize]
                    ],
                    [/((?:i[346]|x)86)[;\)]/i],
                    [
                        [ARCHITECTURE, "ia32"]
                    ],
                    [/windows\s(ce|mobile);\sppc;/i],
                    [
                        [ARCHITECTURE, "arm"]
                    ],
                    [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
                    [
                        [ARCHITECTURE, /ower/, "", util.lowerize]
                    ],
                    [/(sun4\w)[;\)]/i],
                    [
                        [ARCHITECTURE, "sparc"]
                    ],
                    [/(ia64(?=;)|68k(?=\))|arm(?=v\d+;)|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],
                    [ARCHITECTURE, util.lowerize]
                ],
                device: [
                    [/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],
                    [MODEL, VENDOR, [TYPE, TABLET]],
                    [/applecoremedia\/[\w\.]+ \((ipad)/],
                    [MODEL, [VENDOR, "Apple"],
                        [TYPE, TABLET]
                    ],
                    [/(apple\s{0,1}tv)/i],
                    [
                        [MODEL, "Apple TV"],
                        [VENDOR, "Apple"]
                    ],
                    [/(hp).+(touchpad)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i],
                    [VENDOR, MODEL, [TYPE, TABLET]],
                    [/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],
                    [MODEL, [VENDOR, "Amazon"],
                        [TYPE, TABLET]
                    ],
                    [/\((ip[honed|\s\w*]+);.+(apple)/i],
                    [MODEL, VENDOR, [TYPE, MOBILE]],
                    [/\((ip[honed|\s\w*]+);/i],
                    [MODEL, [VENDOR, "Apple"],
                        [TYPE, MOBILE]
                    ],
                    [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola)[\s_-]?([\w-]+)*/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i],
                    [VENDOR, MODEL, [TYPE, MOBILE]],
                    [/\((bb10);\s(\w+)/i],
                    [
                        [VENDOR, "BlackBerry"], MODEL, [TYPE, MOBILE]
                    ],
                    [/android.+((transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7))/i],
                    [
                        [VENDOR, "Asus"], MODEL, [TYPE, TABLET]
                    ],
                    [/(sony)\s(tablet\s[ps])/i],
                    [VENDOR, MODEL, [TYPE, TABLET]],
                    [/(nintendo)\s([wids3u]+)/i],
                    [VENDOR, MODEL, [TYPE, CONSOLE]],
                    [/((playstation)\s[3portablevi]+)/i],
                    [
                        [VENDOR, "Sony"], MODEL, [TYPE, CONSOLE]
                    ],
                    [/(sprint\s(\w+))/i],
                    [
                        [VENDOR, mapper.str, maps.device.sprint.vendor],
                        [MODEL, mapper.str, maps.device.sprint.model],
                        [TYPE, MOBILE]
                    ],
                    [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w+)*/i, /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],
                    [VENDOR, [MODEL, /_/g, " "],
                        [TYPE, MOBILE]
                    ],
                    [/\s((milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?))[\w\s]+build\//i, /(mot)[\s-]?(\w+)*/i],
                    [
                        [VENDOR, "Motorola"], MODEL, [TYPE, MOBILE]
                    ],
                    [/android.+\s((mz60\d|xoom[\s2]{0,2}))\sbuild\//i],
                    [
                        [VENDOR, "Motorola"], MODEL, [TYPE, TABLET]
                    ],
                    [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i],
                    [
                        [VENDOR, "Samsung"], MODEL, [TYPE, TABLET]
                    ],
                    [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i, /sec-((sgh\w+))/i],
                    [
                        [VENDOR, "Samsung"], MODEL, [TYPE, MOBILE]
                    ],
                    [/(sie)-(\w+)*/i],
                    [
                        [VENDOR, "Siemens"], MODEL, [TYPE, MOBILE]
                    ],
                    [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]+)*/i],
                    [
                        [VENDOR, "Nokia"], MODEL, [TYPE, MOBILE]
                    ],
                    [/android\s3\.[\s\w-;]{10}((a\d{3}))/i],
                    [
                        [VENDOR, "Acer"], MODEL, [TYPE, TABLET]
                    ],
                    [/android\s3\.[\s\w-;]{10}(lg?)-([06cv9]{3,4})/i],
                    [
                        [VENDOR, "LG"], MODEL, [TYPE, TABLET]
                    ],
                    [/(lg) netcast\.tv/i],
                    [VENDOR, [TYPE, SMARTTV]],
                    [/((nexus\s[45]))/i, /(lg)[e;\s-\/]+(\w+)*/i],
                    [
                        [VENDOR, "LG"], MODEL, [TYPE, MOBILE]
                    ],
                    [/android.+((ideatab[a-z0-9\-\s]+))/i],
                    [
                        [VENDOR, "Lenovo"], MODEL, [TYPE, TABLET]
                    ],
                    [/(mobile|tablet);.+rv\:.+gecko\//i],
                    [TYPE, VENDOR, MODEL]
                ],
                engine: [
                    [/APP-([\w\s-\d]+)\/((\d+)?[\w\.]+)/i],
                    [
                        [NAME, "Mobile-App"], VERSION
                    ],
                    [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i],
                    [NAME, VERSION],
                    [/rv\:([\w\.]+).*(gecko)/i],
                    [VERSION, NAME]
                ],
                os: [
                    [/microsoft\s(windows)\s(vista|xp)/i],
                    [NAME, VERSION],
                    [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],
                    [NAME, [VERSION, mapper.str, maps.os.windows.version]],
                    [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
                    [
                        [NAME, "Windows"],
                        [VERSION, mapper.str, maps.os.windows.version]
                    ],
                    [/\((bb)(10);/i],
                    [
                        [NAME, "BlackBerry"], VERSION
                    ],
                    [/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)\/([\w\.]+)/i, /(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego)[\/\s-]?([\w\.]+)*/i],
                    [NAME, VERSION],
                    [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
                    [
                        [NAME, "Symbian"], VERSION
                    ],
                    [/mozilla.+\(mobile;.+gecko.+firefox/i],
                    [
                        [NAME, "Firefox OS"], VERSION
                    ],
                    [/(nintendo|playstation)\s([wids3portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i],
                    [NAME, VERSION],
                    [/(cros)\s[\w]+\s([\w\.]+\w)/i],
                    [
                        [NAME, "Chromium OS"], VERSION
                    ],
                    [/(sunos)\s?([\w\.]+\d)*/i],
                    [
                        [NAME, "Solaris"], VERSION
                    ],
                    [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],
                    [NAME, VERSION],
                    [/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i],
                    [
                        [NAME, "iOS"],
                        [VERSION, /_/g, "."]
                    ],
                    [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i],
                    [NAME, [VERSION, /_/g, "."]],
                    [/(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(macintosh|mac(?=_powerpc)|plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos)/i, /(unix)\s?([\w\.]+)*/i],
                    [NAME, VERSION]
                ]
            },
            UAParser = function(uastring) {
                var ua = uastring || (window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : EMPTY);
                return this instanceof UAParser ? (this.getBrowser = function() {
                    return mapper.rgx.apply(this, regexes.browser)
                }, this.getCPU = function() {
                    return mapper.rgx.apply(this, regexes.cpu)
                }, this.getDevice = function() {
                    return mapper.rgx.apply(this, regexes.device)
                }, this.getEngine = function() {
                    return mapper.rgx.apply(this, regexes.engine)
                }, this.getOS = function() {
                    return mapper.rgx.apply(this, regexes.os)
                }, this.getResult = function() {
                    return {
                        ua: this.getUA(),
                        browser: this.getBrowser(),
                        engine: this.getEngine(),
                        os: this.getOS(),
                        device: this.getDevice(),
                        cpu: this.getCPU()
                    }
                }, this.getUA = function() {
                    return ua
                }, this.setUA = function(uastring) {
                    return ua = uastring, this
                }, void this.setUA(ua)) : new UAParser(uastring).getResult()
            };
        if (typeof exports !== UNDEF_TYPE) typeof module !== UNDEF_TYPE && module.exports && (exports = module.exports = UAParser), exports.UAParser = UAParser;
        else if (window.CwmnUAParser = UAParser, typeof window.jQuery !== UNDEF_TYPE) {
            var $ = window.jQuery,
                parser = new UAParser;
            $.ua = parser.getResult(), $.ua.get = function() {
                return parser.getUA()
            }, $.ua.set = function(uastring) {
                parser.setUA(uastring);
                var result = parser.getResult();
                for (var prop in result) $.ua[prop] = result[prop]
            }
        }
    }(this), window.CwmnCanvasDiff = CwmnCanvasDiff(),
    function() {
        var CwmnBrowserDetect;
        CwmnBrowserDetect = function() {
            function CwmnBrowserDetect(userAgent) {
                null == userAgent && (userAgent = ""), this.parser = new CwmnUAParser(userAgent), this.userAgent = this.parser.getUA()
            }
            var browserSupport, checkSupport;
            return browserSupport = {
                host: {
                    desktop: {
                        Firefox: {
                            minVersion: 30
                        },
                        Chrome: {
                            minVersion: 35
                        },
                        Chromium: {
                            minVersion: 35
                        },
                        IE: {
                            minVersion: 10
                        },
                        Safari: {
                            minVersion: 6
                        }
                    },
                    mobile: {
                        iOS: {
                            "Mobile Safari": {
                                minVersion: 6
                            },
                            Chrome: {
                                minVersion: 35
                            }
                        },
                        Android: {
                            Chrome: {
                                minVersion: 35
                            }
                        }
                    }
                },
                guest: {
                    desktop: {
                        Firefox: {
                            minVersion: 30
                        },
                        Chrome: {
                            minVersion: 35
                        },
                        Chromium: {
                            minVersion: 35
                        },
                        IE: {
                            minVersion: 10
                        },
                        Safari: {
                            minVersion: 6
                        }
                    },
                    mobile: {
                        iOS: {
                            "Mobile Safari": {
                                minVersion: 6
                            },
                            Chrome: {
                                minVersion: 35
                            }
                        },
                        Android: {
                            Chrome: {
                                minVersion: 35
                            }
                        }
                    }
                }
            }, checkSupport = function(specs, supportedBrowsers) {
                var browser, device, majorVer, os;
                if (majorVer = parseInt(specs.browser.major), os = specs.os.name, browser = specs.browser.name, device = specs.device.type) {
                    if (os in supportedBrowsers.mobile && browser in supportedBrowsers.mobile[os]) return majorVer >= supportedBrowsers.mobile[os][browser].minVersion
                } else if (browser in supportedBrowsers.desktop) return majorVer >= supportedBrowsers.desktop[browser].minVersion;
                return !1
            }, CwmnBrowserDetect.prototype.hostSupported = function() {
                return checkSupport(this.specs(), browserSupport.host)
            }, CwmnBrowserDetect.prototype.guestSupported = function() {
                return checkSupport(this.specs(), browserSupport.guest)
            }, CwmnBrowserDetect.prototype.specs = function() {
                return this.parser.getResult()
            }, CwmnBrowserDetect
        }(), window.CwmnBrowserDetect = CwmnBrowserDetect
    }.call(this);
var CwmnSocket = function(Cwmn) {
    var socket, reconnectTimer, expirationTimer, verified, statusMonitor, SocketModel = SocketModel || {},
        Socket = this,
        deferred = null,
        promise = null;
    return Socket.init = function() {
        return Cwmn.logger("Initializing Socket Connection"), Cwmn.loadScript("chrome-extension://lcoijeikhmplofegbmjildgohljeapjo/common/socket.io.js", function() {
            Cwmn.loadScriptCallback([io], Socket.setup, "Socket.IO")
        }), deferred = CwmnQ.defer(), promise = deferred.promise
    }, Socket.setup = function() {
        Cwmn.logger("Socket Connection Setup"), Cwmn.Session.set(), socket = io.connect(Cwmn.url + "/" + Cwmn.userData.screenId, {
            pingInterval: 2e3,
            pingTimeout: 2e3
        }), Socket.onConnect(), deferred.resolve(socket)
    }, Socket.onConnect = function() {
        Cwmn.logger("Socket Connection Connected"), socket.on("connect", function() {
            Cwmn.logger("Connecting to Screen");
            var connectDate = new Date;
            socket && (socket.emit("client_connected", {
                userData: Cwmn.userData,
                browser: Cwmn.userAgent,
                timeOffset: connectDate.getTimezoneOffset(),
                screen_res: screen.width + "x" + screen.height
            }), socket.emit("host_is_connected"))
        }), reconnectTimer = setTimeout(function() {
            Cwmn.logger("Socket couldn't reconnect"), verified || Cwmn.destroy()
        }, 15e3), expirationTimer = setInterval(function() {
            socket.emit("reset_expiration", Socket.stillActive)
        }, 6e4), socket.emit("check_screen_exists", Cwmn.userData.screenId), socket.on("screen_verified", Socket.verified)
    }, Socket.verified = function(screenData) {
        Cwmn.logger("Screen Verified"), verified = !0, clearTimeout(reconnectTimer), "true" === screenData.enablePublic && (Cwmn.enablePublic = !0), socket.on("disconnected", Socket.onDisconnect), socket.on("expired", Socket.onExpired), socket.on("guest_connected", Socket.onGuestConnect), socket.on("guest_disco", Socket.onGuestDisconnect), socket.on("send_data", Socket.onReceiveData), socket.on("send_click", Socket.onReceiveClick), socket.on("check_host_connected", Socket.onCheckHostConnected), socket.on("connect_error", function() {
            Cwmn.logger("Socket.io connect_error")
        }), socket.on("connect_timeout", function() {
            Cwmn.logger("Socket.io connect_timeout")
        }), socket.on("reconnect", function() {
            Cwmn.logger("Socket.io reconnect"), socket && Cwmn.UI.reconnect()
        }), socket.on("reconnect_attempt", function() {
            Cwmn.logger("Socket.io reconnect_attempt")
        }), socket.on("reconnecting", function() {
            Cwmn.logger("Socket.io reconnecting")
        }), socket.on("reconnect_error", function() {
            Cwmn.logger("Socket.io reconnect_error"), socket && Cwmn.UI.reconnectError()
        }), socket.on("reconnect_failed", function() {
            Cwmn.logger("Socket.io reconnect_failed"), socket && Cwmn.UI.reconnectError()
        })
    }, Socket.onDisconnect = function() {
        Cwmn.logger("Screen Disconnected"), CwmnAlertify.alert("Your Click With Me Now Session has been disconnected.", function() {
            Cwmn.destroy()
        })
    }, Socket.onExpired = function() {
        socket.emit("screen_expired", Cwmn.userData), Cwmn.logger("Screen Expired"), Cwmn.UI.Mouse.disable(), CwmnAlertify.alert(CwmnLang.alertify.expired, function() {
            Cwmn.destroy()
        })
    }, Socket.onGuestConnect = function(data) {
        Cwmn.logger("guest connected"), Cwmn.utilitiesLoaded || Cwmn.Utilities.load();
        var newData = data.data,
            roomData = data.roomData;
        if (roomData && Cwmn.compact_array(roomData, void 0), Cwmn.logger("Guest (" + newData.name + ") connected with id " + newData.id), !Cwmn.getById(newData.id)) {
            var inviteObj = Cwmn.userData.addInviteData(newData);
            Cwmn.UI.addGuest(inviteObj)
        }
        Cwmn.UI.setGuestStatus(newData.id, "connected"), newData.hidden && Cwmn.UI.Mouse.hide(newData.id), CwmnAlertify.log(newData.name + " " + CwmnLang.alertify.guestConnect, "success", Cwmn.AlertifyLogDelay, "cwmn-guest-connected"), Cwmn.Render.locutus.beginParse(), Cwmn.userData.waitingForGuest = !1, Cwmn.Session.set()
    }, Socket.onGuestDisconnect = function(data) {
        Cwmn.logger("Guest Disconnected"), CwmnAlertify.log(data.name + " " + CwmnLang.alertify.guestDisconnect, "error", Cwmn.AlertifyLogDelay, "cwmn-guest-disconnected"), Cwmn.UI.removeGuest(data), Cwmn.userData.removeInviteData(data.id), Cwmn.Session.set()
    }, Socket.onReceiveData = function(data) {
        data && Cwmn.compact_array(data, void 0), data.length <= 1 ? Cwmn.userData.waitingForGuest = !0 : Cwmn.utilitiesLoaded || (Cwmn.logger("Calling Cwmn.Utilities.load()"), Cwmn.Utilities.load()), Cwmn.Session.set(), Cwmn.UI.Mouse.update(data)
    }, Socket.onReceiveClick = function(data) {
        console.log("Click " + data), Cwmn.UI.Mouse.clickReceived(data)
    }, Socket.onCheckHostConnected = function() {
        Cwmn.userData && socket.emit("host_is_connected", Cwmn.userData)
    }, Socket.trackMouse = function(x, y) {
        Cwmn.userData.x = x, Cwmn.userData.y = y, socket.emit("update_coords", Cwmn.userData), Cwmn.Session.set()
    }, Socket.trackClick = function() {
        socket && socket.emit("click", Cwmn.userData.id)
    }, Socket.togglePrivacy = function(data) {
        socket && socket.emit("togglePrivacy", data)
    }, Socket.passDom = function(canvas) {
        Cwmn.logger("Socket.passDom"), promise ? promise.then(function(socket) {
            socket.emit("pass_canvas", {
                canvas: canvas.toDataURL("image/jpeg", Cwmn.imageQuality),
                docWidth: Cwmn.viewport().width,
                docHeight: Cwmn.viewport().height,
                screenId: Cwmn.userData.screenId
            })
        }) : Cwmn.logger("passDom: socket not yet initialized")
    }, Socket.passDomFragment = function(fragment) {
        Cwmn.logger("Socket.passDomFragment"), promise ? promise.then(function(socket) {
            socket.emit("pass_fragment", {
                id: fragment.id,
                image: fragment.imgString,
                x: fragment.x,
                y: fragment.y,
                width: fragment.width,
                height: fragment.height,
                screenId: Cwmn.userData.screenId
            })
        }) : Cwmn.logger("passDomFragment: socket not yet initialized")
    }, Socket.discoNotice = function() {
        socket && socket.emit("disco_notice", Cwmn.userData), Cwmn.destroy()
    }, Socket.discoGuest = function(data) {
        socket.emit("disconnect_guest", data)
    }, Socket.toggleGuestMouse = function(data, visible) {
        socket.emit("toggle_guest_mouse", {
            guest: data,
            isHidden: visible
        })
    }, Socket.publicLink = function(bool) {
        socket.emit("toggle_public_link", {
            openPub: bool,
            screenId: Cwmn.userData.screenId
        })
    }, Socket.stillActive = function() {}, Socket.destroy = function() {
        Cwmn.logger("Destroying Socket"), socket && socket.disconnect(), socket = null, verified = null, clearInterval(expirationTimer), clearInterval(reconnectTimer), Cwmn.removeScriptCssFile("socket.io.js", "js"), statusMonitor = null
    }, SocketModel = {
        init: Socket.init,
        passDom: Socket.passDom,
        passDomFragment: Socket.passDomFragment,
        trackMouse: Socket.trackMouse,
        trackClick: Socket.trackClick,
        discoNotice: Socket.discoNotice,
        destroy: Socket.destroy,
        discoGuest: Socket.discoGuest,
        toggleMouse: Socket.toggleGuestMouse,
        togglePrivacy: Socket.togglePrivacy,
        publicLink: Socket.publicLink,
        stillActive: Socket.stillActive
    }
};
(function() {
    var CwmnUI, EmailInviteView, EndSessionView, Guest, GuestList, HostDashboardView, InviteSelectionView, InviteToHostView, InviteView, Mouse, MouseTrack, Pointer, Privacy, Slider, SmsInviteView, Tab, Tooltip, UIElement, UIView, UrlInviteView, addChildren, addClass, brandingHTML, endSessionViewHTML, escape, guestButtonHTML, guestListHTML, guestRowHTML, hasClass, inviteToHostHTML, mousePointerHTML, privacySwitchHTML, removeClass, sidebarContentAreaHTML, silenceGuestsLinkHTML, smsInviteViewHTML, stringToDOM, tabHTML, toggleClass, tooltipHTML, validateEmail, __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) {
            function ctor() {
                this.constructor = child
            }
            for (var key in parent) __hasProp.call(parent, key) && (child[key] = parent[key]);
            return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
        },
        __slice = [].slice;
    window.CwmnUI = CwmnUI = function() {
        function CwmnUI(Cwmn) {
            this.Cwmn = Cwmn, this.Cwmn.logger("Building UI"), this.cssUrl = "https://assets.clickwith.me/stylesheets/newui.css?v=2.3.2", this.parentElement = stringToDOM('<div id="cwmn-panel" class="locutus-skip" data-html2canvas-ignore="true"></div>'), document.body.appendChild(this.parentElement), this.Cwmn.loadCss(this.cssUrl), this.slider = new Slider(this), this.tab = new Tab(this, this.slider), this.slider.build(), this.parentElement.appendChild(this.slider.getElement()), this.parentElement.appendChild(this.tab.getElement()), this.html = document.documentElement, this.body = document.body, this.Mouse = new Mouse(this), this.MouseTrack = new MouseTrack(this), this.rootView = new InviteSelectionView(this), this.slider.push(this.rootView), this.guests = {}, this.guestsLoaded = !1, this.hosting = !1, this.supported = !0, this.connectionError = !1, this.supportsMouse = "onmousemove" in window, this.supportsTouch = "ontouchstart" in window || navigator.msMaxTouchPoints, window.localStorage && "true" !== window.localStorage.getItem("cwmn:hasVisited") && (window.localStorage.setItem("cwmn:hasVisited", "true"), this.tab.tooltip.show(), setTimeout(function(_this) {
                return function() {
                    return _this.tab.tooltip["default"]()
                }
            }(this), 5e3)), this.pointerContainer = stringToDOM('<div class="pointers"></div>'), this.parentElement.appendChild(this.pointerContainer), this.elementCheckInterval = setInterval(function(_this) {
                return function() {
                    return document.getElementById("cwmn-panel") ? void 0 : document.body.appendChild(_this.parentElement)
                }
            }(this), 500)
        }
        return CwmnUI.prototype.addGuest = function(guest) {
            var _ref;
            return this.guests[guest.id] = guest, null != (_ref = this.hostDashboardView) ? _ref.refresh() : void 0
        }, CwmnUI.prototype.removeGuest = function(guest) {
            var _ref;
            return delete this.guests[guest.id], this.Mouse.remove(guest.id), null != (_ref = this.hostDashboardView) ? _ref.guestList.refresh() : void 0
        }, CwmnUI.prototype.loadGuestsFromSessionData = function() {
            var id, invite, _ref, _results;
            if (null != this.Cwmn.userData.inviteData) {
                _ref = this.Cwmn.userData.inviteData, _results = [];
                for (id in _ref) invite = _ref[id], _results.push("size" !== id ? this.addGuest(invite) : void 0);
                return _results
            }
        }, CwmnUI.prototype.setGuestStatus = function(guestId, status) {
            return null != this.guests[guestId] && (this.guests[guestId].status = status), this.hostDashboardView ? this.hostDashboardView.refresh() : void 0
        }, CwmnUI.prototype.activate = function() {
            return this.supported ? this.slider.show() : window.open(this.Cwmn.url + "/unsupported", "", "toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=900,height=700,left=50,top=50,titlebar=yes")
        }, CwmnUI.prototype.deactivate = function() {
            return this.slider.hide()
        }, CwmnUI.prototype.startHosting = function() {
            return this.hosting = !0, this.guestsLoaded || this.loadGuestsFromSessionData(), this.guestsLoaded = !0, this.hostDashboardView = new HostDashboardView(this), this.slider.setRootView(this.hostDashboardView), this.tab.setActiveSession(!0), this.tab.tooltip.hide(), this.MouseTrack.enable()
        }, CwmnUI.prototype.unsupported = function() {
            return this.supported = !1
        }, CwmnUI.prototype.destroy = function() {
            return this.parentElement.parentNode.removeChild(this.parentElement), this.Cwmn.removeScriptCssFile(this.cssUrl, "css"), this.MouseTrack.disable(), clearInterval(this.elementCheckInterval), this
        }, CwmnUI.prototype.reconnect = function() {
            return this.connectionError ? (this.connectionError = !1, CwmnAlertify.log("Your connection has been restored.", "success", 5e3)) : void 0
        }, CwmnUI.prototype.reconnectError = function() {
            return this.connectionError ? void 0 : (this.connectionError = !0, CwmnAlertify.log("Your connection has been interrupted. Others may not be able to see what's on your screen.", "error", 1e4))
        }, CwmnUI
    }(), UIElement = function() {
        function UIElement() {}
        return UIElement.prototype.getElement = function() {
            return this.element
        }, UIElement
    }(), UIView = function(_super) {
        function UIView() {
            return UIView.__super__.constructor.apply(this, arguments)
        }
        return __extends(UIView, _super), UIView
    }(UIElement), Tooltip = function(_super) {
        function Tooltip(UI) {
            this.UI = UI, this.element = tooltipHTML()
        }
        return __extends(Tooltip, _super), Tooltip.prototype.show = function() {
            return this["default"](), addClass(this.element, "show")
        }, Tooltip.prototype.hide = function() {
            return this["default"](), addClass(this.element, "hide")
        }, Tooltip.prototype["default"] = function() {
            return removeClass(this.element, "hide"), removeClass(this.element, "show")
        }, Tooltip
    }(UIElement), Tab = function(_super) {
        function Tab(UI, slider) {
            var _ref;
            this.UI = UI, this.slider = slider, _ref = tabHTML(), this.element = _ref[0], this.icon = _ref[1], this.privateIcon = _ref[2], this.element.appendChild(this.icon), this.element.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.UI.activate(), event.preventDefault()
                }
            }(this)), this.setActiveSession(!1), this.setPrivacy(!1), this.tooltip = new Tooltip(this.UI), this.element.appendChild(this.tooltip.getElement())
        }
        return __extends(Tab, _super), Tab.prototype.setActiveSession = function(isActive) {
            return this.active = isActive, this.active ? addClass(this.element, "active") : removeClass(this.element, "active")
        }, Tab.prototype.setPrivacy = function(isPrivate) {
            return this["private"] = isPrivate, this.element.removeChild(this.element.firstChild), this.element.appendChild(this["private"] ? this.privateIcon : this.icon)
        }, Tab
    }(UIElement), Slider = function(_super) {
        function Slider(UI) {
            this.UI = UI, this.sidebarVisible = !1, this.views = []
        }
        return __extends(Slider, _super), Slider.prototype.build = function() {
            return this.element = stringToDOM('<div class="sidr left" id="sidr"></div>'), this.contentArea = sidebarContentAreaHTML(), this.element.appendChild(this.contentArea), this.closeBtn = stringToDOM('<a class="pull-right btn btn-lg min-btn collapse in" id="min-menu"></a>'), this.closeBtn.innerHTML = '<i class="pe-7s-angle-left"></i>', this.element.appendChild(this.closeBtn), this.element.appendChild(brandingHTML()), this.closeBtn.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.UI.deactivate(), event.preventDefault()
                }
            }(this)), this
        }, Slider.prototype.toggleVisible = function() {
            return (this.sidebarVisible = !this.sidebarVisible) ? this.show() : this.hide()
        }, Slider.prototype.show = function() {
            return this.element.style.display = "block", this.UI.tab.tooltip.hide()
        }, Slider.prototype.hide = function() {
            return this.element.style.display = "none", this.UI.hosting ? void 0 : this.UI.tab.tooltip["default"]()
        }, Slider.prototype.setContent = function(element) {
            return this.contentArea.innerHTML = "", this.contentArea.appendChild(element)
        }, Slider.prototype.push = function(view) {
            return this.views.push(view), this.setContent(view.getElement())
        }, Slider.prototype.pop = function() {
            return this.views.pop(), this.setContent(this.views.slice(-1)[0].getElement())
        }, Slider.prototype.setRootView = function(view) {
            return this.views = [], this.push(view)
        }, Slider
    }(UIElement), InviteSelectionView = function(_super) {
        function InviteSelectionView(UI, more) {
            var form, hostEmailGroup, hostNameGroup;
            this.UI = UI, this.more = null != more ? more : !1, this.element = stringToDOM('<div class="in"><h3>Invite a friend to share your screen.</h3></div>'), this.more || (form = document.createElement("form"), this.hostNameLabel = stringToDOM('<label for="inputYourName" class="control-label">Your Name</label>'), this.hostNameField = stringToDOM('<input type="text" class="form-control" id="inputYourName" placeholder="Introduce yourself">'), hostNameGroup = addChildren(stringToDOM('<div class="form-group"></div>'), this.hostNameLabel, this.hostNameField), this.hostEmailLabel = stringToDOM('<label for="inputYourEmail" class="control-label">Your Email</label>'), this.hostEmailField = stringToDOM('<input type="email" class="form-control" id="inputYourEmail" placeholder="where@itiscomingfrom.com">'), hostEmailGroup = addChildren(stringToDOM('<div class="form-group"></div>'), this.hostEmailLabel, this.hostEmailField), hostEmailGroup.appendChild(stringToDOM('<p class="help-block"></p>')), addChildren(form, hostNameGroup, hostEmailGroup), this.element.appendChild(form)), this.emailButton = stringToDOM('<a class="btn btn-default btn-lg btn-block btn-icon btn-email" href="#"></a>'), this.emailButton.innerHTML = '<i class="pe-7s-paper-plane"></i> Email', this.element.appendChild(this.emailButton), this.emailButton.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.doEmailInvite(), event.preventDefault()
                }
            }(this)), this.smsButton = stringToDOM('<a class="btn btn-default btn-lg btn-block btn-icon btn-sms" href="#"></a>'), this.smsButton.innerHTML = '<i class="pe-7s-comment"></i> SMS Text', this.element.appendChild(this.smsButton), this.smsButton.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.doSmsInvite(), event.preventDefault()
                }
            }(this)), this.urlButton = stringToDOM('<a class="btn btn-default btn-lg btn-block btn-icon btn-url" href="#"></a>'), this.urlButton.innerHTML = '<i class="pe-7s-link"></i> Public Link', this.element.appendChild(this.urlButton), this.urlButton.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.doUrlInvite(), event.preventDefault()
                }
            }(this)), this.more || (this.inviteToHostButton = stringToDOM('<a class="btn btn-default btn-lg btn-block btn-icon btn-ith" href="#"></a>'), this.inviteToHostButton.innerHTML = '<i class="pe-7s-star"></i> Invite to Host', this.element.appendChild(this.inviteToHostButton), this.inviteToHostButton.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.doInviteToHost(), event.preventDefault()
                }
            }(this))), this.more && (this.backButton = stringToDOM('<a class="text-center center-block" href="#">Cancel</a>'), this.backButton.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.UI.slider.pop(), event.preventDefault()
                }
            }(this)), this.element.appendChild(this.backButton))
        }
        return __extends(InviteSelectionView, _super), InviteSelectionView.prototype.validateFields = function() {
            var email, name;
            return this.more ? !0 : (name = this.hostNameField.value.trim(), email = this.hostEmailField.value.trim(), name && email ? validateEmail(email) ? !0 : (CwmnAlertify.alert("Please enter a valid email address."), !1) : (CwmnAlertify.alert("Name and email are required."), !1))
        }, InviteSelectionView.prototype.initiateScreenIfNecessary = function(callback) {
            return this.more ? callback() : this.UI.Cwmn.sessionAPI.initializeScreen({
                hostName: this.hostNameField.value,
                hostEmail: this.hostEmailField.value
            }, callback)
        }, InviteSelectionView.prototype.doEmailInvite = function() {
            return this.validateFields() ? this.more ? this.UI.slider.push(new EmailInviteView(this.UI, this.more)) : this.initiateScreenIfNecessary(function(_this) {
                return function() {
                    return _this.more = !0, _this.UI.slider.push(new EmailInviteView(_this.UI, _this.more))
                }
            }(this)) : !1
        }, InviteSelectionView.prototype.doSmsInvite = function() {
            return this.validateFields() ? this.more ? this.UI.slider.push(new SmsInviteView(this.UI, this.more)) : this.initiateScreenIfNecessary(function(_this) {
                return function() {
                    return _this.more = !0, _this.UI.slider.push(new SmsInviteView(_this.UI, _this.more))
                }
            }(this)) : !1
        }, InviteSelectionView.prototype.doUrlInvite = function() {
            return this.validateFields() ? this.more ? this.UI.slider.push(new UrlInviteView(this.UI, this.more)) : this.initiateScreenIfNecessary(function(_this) {
                return function() {
                    return _this.more = !0, _this.UI.slider.push(new UrlInviteView(_this.UI, _this.more))
                }
            }(this)) : !1
        }, InviteSelectionView.prototype.doInviteToHost = function() {
            var ithv;
            return this.validateFields() ? (ithv = new InviteToHostView(this.UI, !1), ithv.hostName = this.hostNameField.value, ithv.hostEmail = this.hostEmailField.value, this.UI.slider.push(ithv)) : !1
        }, InviteSelectionView
    }(UIView), InviteView = function(_super) {
        function InviteView(UI, more) {
            this.UI = UI, this.more = null != more ? more : !1, this.element = stringToDOM('<div class="in"><h3>Invite a friend to share your screen.</h3></div>'), this.form = this.createForm(), this.element.appendChild(this.form), this.button = stringToDOM('<a class="btn btn-primary btn-lg btn-block btn-icon"></a>'), this.button.appendChild(stringToDOM('<i class="' + this.buttonIcon() + '"></i>')), this.button.appendChild(stringToDOM(this.buttonText())), this.form.appendChild(this.button), this.button.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.onSubmit(), event.preventDefault()
                }
            }(this)), this.chooseDifferent = stringToDOM('<a class="text-center center-block" href="#">Choose a different sharing method</a>'), this.element.appendChild(this.chooseDifferent), this.chooseDifferent.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.UI.slider.pop(), event.preventDefault()
                }
            }(this))
        }
        return __extends(InviteView, _super), InviteView
    }(UIView), EmailInviteView = function(_super) {
        function EmailInviteView() {
            return EmailInviteView.__super__.constructor.apply(this, arguments)
        }
        return __extends(EmailInviteView, _super), EmailInviteView.prototype.createForm = function() {
            var form, guestEmailGroup, guestHelpText, guestNameGroup, messageGroup;
            return form = document.createElement("form"), guestHelpText = stringToDOM('<p class="help-block">Your friend\'s info goes here:</p>'), this.guestNameLabel = stringToDOM('<label for="inputFriendName" class="control-label">Friend\'s Name</label>'), this.guestNameField = stringToDOM('<input type="text" class="form-control" id="inputFriendName" placeholder="Who should receive this?">'), guestNameGroup = addChildren(stringToDOM('<div class="form-group"></div>'), guestHelpText, this.guestNameLabel, this.guestNameField), this.guestEmailLabel = stringToDOM('<label for="inputFriendEmail" class="control-label">Friend\'s Email</label>'), this.guestEmailField = stringToDOM('<input type="email" class="form-control" id="inputFriendEmail" placeholder="where@isthisgoing.com">'), guestEmailGroup = addChildren(stringToDOM('<div class="form-group"></div>'), this.guestEmailLabel, this.guestEmailField), this.messageLabel = stringToDOM('<label for="textFriendMessage" class="control-label">Message</label>'), this.messageField = stringToDOM('<textarea class="form-control" rows="3" placeholder="Send a personal message..."></textarea>'), messageGroup = addChildren(stringToDOM('<div class="form-group"></div>'), this.messageLabel, this.messageField), addChildren(form, guestNameGroup, guestEmailGroup, messageGroup), form
        }, EmailInviteView.prototype.buttonText = function() {
            return "Send Invitation"
        }, EmailInviteView.prototype.buttonIcon = function() {
            return "pe-7s-paper-plane"
        }, EmailInviteView.prototype.onSubmit = function() {
            return this.validateFields() ? (this.UI.Cwmn.sessionAPI.emailInvite({
                guestName: this.guestNameField.value,
                guestEmail: this.guestEmailField.value,
                message: this.messageField.value
            }, !0), this.UI.startHosting()) : void 0
        }, EmailInviteView.prototype.validateFields = function() {
            var guestEmail, guestName, message;
            return guestName = this.guestNameField.value, guestEmail = this.guestEmailField.value, message = this.messageField.value, guestName && guestEmail && message ? validateEmail(guestEmail) ? !0 : (CwmnAlertify.alert("Please enter a valid email address."), !1) : (CwmnAlertify.alert("All fields are required."), !1)
        }, EmailInviteView
    }(InviteView), SmsInviteView = function(_super) {
        function SmsInviteView() {
            return SmsInviteView.__super__.constructor.apply(this, arguments)
        }
        return __extends(SmsInviteView, _super), SmsInviteView.prototype.createForm = function() {
            var form, _ref;
            return _ref = smsInviteViewHTML(), form = _ref[0], this.guestNameField = _ref[1], this.smsField = _ref[2], form
        }, SmsInviteView.prototype.buttonText = function() {
            return "Send"
        }, SmsInviteView.prototype.buttonIcon = function() {
            return "pe-7s-comment"
        }, SmsInviteView.prototype.onSubmit = function() {
            return this.UI.Cwmn.logger("sms form submit"), this.UI.Cwmn.sessionAPI.smsInvite({
                guestName: this.guestNameField.value,
                guestPhone: this.smsField.value
            }), this.UI.startHosting()
        }, SmsInviteView
    }(InviteView), UrlInviteView = function(_super) {
        function UrlInviteView() {
            return UrlInviteView.__super__.constructor.apply(this, arguments)
        }
        return __extends(UrlInviteView, _super), UrlInviteView.prototype.createForm = function() {
            var form, formGroup;
            return this.UI.Cwmn.publicLink.activate(), this.link = this.UI.Cwmn.publicLink.generate(), form = stringToDOM("<form></form>"), formGroup = stringToDOM('<div class="form-group"></div>'), this.fieldLabel = stringToDOM('<label for="inputYourName" class="control-label">Share this Public URL</label>'), this.field = stringToDOM('<input type="url" class="form-control" readonly>'), this.field.value = this.link, formGroup.appendChild(this.fieldLabel), formGroup.appendChild(this.field), form.appendChild(formGroup), form
        }, UrlInviteView.prototype.buttonText = function() {
            return "Got it!"
        }, UrlInviteView.prototype.buttonIcon = function() {
            return "pe-7s-link"
        }, UrlInviteView.prototype.onSubmit = function() {
            return this.UI.startHosting()
        }, UrlInviteView
    }(InviteView), InviteToHostView = function(_super) {
        function InviteToHostView() {
            return InviteToHostView.__super__.constructor.apply(this, arguments)
        }
        return __extends(InviteToHostView, _super), InviteToHostView.prototype.createForm = function() {
            var _ref;
            return this.element = stringToDOM('<div class="in"><h3>Invite a friend to share their screen with you.</h3></div>'), _ref = inviteToHostHTML(), this.form = _ref[0], this.guestNameField = _ref[1], this.guestEmailField = _ref[2], this.messageField = _ref[3], this.form
        }, InviteToHostView.prototype.buttonText = function() {
            return "Send Invitation"
        }, InviteToHostView.prototype.buttonIcon = function() {
            return "pe-7s-paper-plane"
        }, InviteToHostView.prototype.onSubmit = function() {
            return this.UI.Cwmn.sessionAPI.inviteToHost({
                hostName: this.hostName,
                hostEmail: this.hostEmail,
                inviteName: this.guestNameField.value,
                inviteEmail: this.guestEmailField.value,
                message: this.messageField.value,
                url: window.location.href
            }, function(_this) {
                return function(response) {
                    return CwmnAlertify.alert("Your Click With Me Now session will now open in a new window/tab.", function() {
                        return _this.UI.Cwmn.Session.destroy(), window.open(response.inviteLink), _this.UI.Cwmn.destroy()
                    })
                }
            }(this), function() {
                return function() {
                    return CwmnAlertify.alert("There was an error sending your invite. Please try again.")
                }
            }(this))
        }, InviteToHostView
    }(InviteView), HostDashboardView = function(_super) {
        function HostDashboardView(UI) {
            this.UI = UI, this.element = stringToDOM('<div class="in"><h3>You are hosting a Click With Me Now session.</h3></div>'), this.element.appendChild(stringToDOM("<label>People in session:</label>")), this.guestList = new GuestList(this.UI), this.element.appendChild(this.guestList.getElement()), this.privacy = new Privacy(this.UI), this.element.appendChild(this.privacy.getElement()), this.endSessionButton = stringToDOM('<a class="btn btn-default btn-lg btn-block btn-icon btn-end" href="#"><i class="pe-7s-power"></i> End Session</a>'), this.element.appendChild(this.endSessionButton), this.endSessionButton.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.UI.slider.push(new EndSessionView(_this.UI)), event.preventDefault()
                }
            }(this)), this.refresh()
        }
        return __extends(HostDashboardView, _super), HostDashboardView.prototype.refresh = function() {
            return this.guestList.refresh()
        }, HostDashboardView
    }(UIView), EndSessionView = function(_super) {
        function EndSessionView(UI) {
            var _ref;
            this.UI = UI, _ref = endSessionViewHTML(), this.element = _ref[0], this.confirm = _ref[1], this.cancel = _ref[2], this.confirm.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.UI.Cwmn.Socket.discoNotice(), event.preventDefault()
                }
            }(this)), this.cancel.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.UI.slider.pop(), event.preventDefault()
                }
            }(this))
        }
        return __extends(EndSessionView, _super), EndSessionView
    }(UIView), GuestList = function(_super) {
        function GuestList(UI) {
            var _ref;
            this.UI = UI, _ref = guestListHTML(), this.element = _ref[0], this.addGuestButton = _ref[1], this.addGuestButton.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.UI.slider.push(new InviteSelectionView(_this.UI, !0)), event.preventDefault()
                }
            }(this)), this.refresh()
        }
        return __extends(GuestList, _super), GuestList.prototype.refresh = function() {
            var guest, guestObj, guid, _ref, _results;
            this.clear(), this.hostGuest = new Guest(this.UI, {
                name: "You",
                host: !0
            }, this), this.element.appendChild(this.hostGuest.getElement()), _ref = this.UI.guests, _results = [];
            for (guid in _ref) guestObj = _ref[guid], guest = new Guest(this.UI, guestObj, this), _results.push(this.element.appendChild(guest.getElement()));
            return _results
        }, GuestList.prototype.clear = function() {
            for (; this.element.firstChild;) this.element.removeChild(this.element.firstChild);
            return this.element.appendChild(this.addGuestButton)
        }, GuestList
    }(UIElement), Guest = function(_super) {
        function Guest(UI, guestObj, guestList) {
            var role, _ref;
            this.UI = UI, this.guestObj = guestObj, this.guestList = guestList, this.element = stringToDOM('<div class="dropdown"></div>'), role = this.guestObj.host ? "Host" : "Guest", this.element.appendChild(guestRowHTML(this.guestObj.name, role, null != this.guestObj.host)), "Guest" === role && (_ref = guestButtonHTML(), this.buttonWrapper = _ref[0], this.muteBtn = _ref[1], this.delBtn = _ref[2], this.starBtn = _ref[3], this.element.appendChild(this.buttonWrapper), this.element.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.toggleButtons(), event.preventDefault()
                }
            }(this)), this.muteBtn.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.mute(), event.preventDefault()
                }
            }(this)), this.delBtn.addEventListener("click", function(_this) {
                return function(event) {
                    return CwmnAlertify.confirm("Remove " + escape(_this.guestObj.name) + "?", function(e) {
                        return e ? _this.remove() : void 0
                    }), event.preventDefault()
                }
            }(this)), this.starBtn.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.star(), event.preventDefault()
                }
            }(this)), this.star)
        }
        return __extends(Guest, _super), Guest.prototype.toggleButtons = function() {
            return toggleClass(this.element, "open")
        }, Guest.prototype.mute = function() {
            return this
        }, Guest.prototype.remove = function() {
            return this.UI.removeGuest(this.guestObj), this.UI.Cwmn.Socket.discoGuest(this.guestObj), this.UI.Cwmn.userData.removeInviteData(this.guestObj.id), this.guestList.refresh()
        }, Guest.prototype.star = function() {
            return this
        }, Guest
    }(UIElement), Privacy = function(_super) {
        function Privacy(UI) {
            var _ref;
            this.UI = UI, _ref = privacySwitchHTML(), this.toggleLabel = _ref[0], this.toggle = _ref[1], this.onBtn = _ref[2], this.offBtn = _ref[3], this.enabled = this.UI.Cwmn.userData.privacy, this.element = stringToDOM("<div></div>"), this.element.appendChild(this.toggleLabel), this.element.appendChild(this.toggle), this.UI.tab.setPrivacy(this.enabled), this.toggle.addEventListener("click", function(_this) {
                return function(event) {
                    return _this.togglePrivacy(), event.preventDefault()
                }
            }(this)), this.enabled && this.toggleSwitch()
        }
        return __extends(Privacy, _super), Privacy.prototype.togglePrivacy = function() {
            return this.UI.Cwmn.logger("Toggle privacy"), this.enabled = !this.enabled, this.UI.tab.setPrivacy(this.enabled), this.toggleSwitch(), this.UI.Cwmn.privacy.set(this.enabled)
        }, Privacy.prototype.toggleSwitch = function() {
            var element, _i, _len, _ref, _results;
            for (_ref = [this.onBtn, this.offBtn], _results = [], _i = 0, _len = _ref.length; _len > _i; _i++) element = _ref[_i], toggleClass(element, "active"), toggleClass(element, "btn-primary"), _results.push(toggleClass(element, "btn-default"));
            return _results
        }, Privacy
    }(UIElement), Pointer = function(_super) {
        function Pointer(UI, name, email, isHost, id) {
            var _ref;
            this.UI = UI, this.name = name, this.email = email, this.isHost = isHost, this.id = id, _ref = mousePointerHTML(), this.element = _ref[0], this.letter = _ref[1], this.tooltip = _ref[2], this.image = _ref[3], this.ptrImage = _ref[4], this.text = _ref[5], this.dot = _ref[6], this.pulsing = !1, this.x = 1, this.y = 1, this.update()
        }
        return __extends(Pointer, _super), Pointer.prototype.update = function() {
            var email, emailHash, name;
            return this.pulsing || (this.element.style.left = this.x + 3 + "px", this.element.style.top = this.y + 2 + "px"), this.initialized ? void 0 : (this.initialized = !0, name = this.name.trim(), email = this.email.trim().toLowerCase(), emailHash = this.UI.Cwmn.MD5(email), this.image.src = "https://www.gravatar.com/avatar/" + emailHash + ".png?s=80&default=mm", this.ptrImage.src = "https://www.gravatar.com/avatar/" + emailHash + ".png?s=34&default=404", this.ptrImage.onerror = function(_this) {
                return function() {
                    return _this.removed ? void 0 : (_this.ptrImage.parentNode.removeChild(_this.ptrImage), delete _this.ptrImage, _this.removed = !0)
                }
            }(this), this.text.innerHTML = escape(name), this.letter.innerHTML = escape(name.trim()[0].toUpperCase()))
        }, Pointer.prototype.hide = function() {
            return this.UI.pointerContainer.removeChild(this.element), this
        }, Pointer.prototype.show = function() {
            return this.element.parentElement !== this.UI.pointerContainer && this.UI.pointerContainer.appendChild(this.element), this
        }, Pointer.prototype.remove = function() {
            return this.hide()
        }, Pointer.prototype.setPosition = function(x, y) {
            var _ref;
            return _ref = [x, y], this.x = _ref[0], this.y = _ref[1], this.update()
        }, Pointer.prototype.pulse = function() {
            var animationCallback;
            return this.pulsing ? void 0 : (this.pulsing = !0, this.dot.style.webkitAnimationName = "pulse", this.dot.style.animationName = "pulse", animationCallback = function(_this) {
                return function() {
                    return _this.dot.style.webkitAnimationName = "", _this.dot.style.animationName = "", _this.dot.removeEventListener("webkitAnimationEnd", animationCallback, !1), _this.dot.removeEventListener("animationEnd", animationCallback, !1), null != _this.animationTimeout && (clearTimeout(_this.animationTimeout), _this.animationTimeout = null), _this.pulsing = !1, _this.update()
                }
            }(this), this.dot.addEventListener("webkitAnimationEnd", animationCallback, !1), this.dot.addEventListener("animationEnd", animationCallback, !1), this.animationTimeout = setTimeout(animationCallback, 1500))
        }, Pointer
    }(UIElement), Mouse = function() {
        function Mouse(UI) {
            this.UI = UI, this.guestPointers = {}, this.Cwmn = this.UI.Cwmn, this.getById = this.Cwmn.getById, this.body = this.UI.body
        }
        return Mouse.prototype.remove = function(id) {
            var pointer;
            return pointer = this.guestPointers[id], pointer && (delete this.guestPointers[id], pointer.remove()), pointer
        }, Mouse.prototype.hide = function(id) {
            var pointer;
            return pointer = this.guestPointers[id], pointer ? pointer.hide() : void 0
        }, Mouse.prototype.show = function(id) {
            var pointer;
            return pointer = this.guestPointers[id], pointer ? pointer.show() : void 0
        }, Mouse.prototype.update = function(mouseData) {
            var guestPointer, user, _i, _len, _results;
            for (_results = [], _i = 0, _len = mouseData.length; _len > _i; _i++) user = mouseData[_i], user.id !== this.Cwmn.userData.id ? (guestPointer = this.guestPointers[user.id], guestPointer ? (user.hidden ? guestPointer.hide() : guestPointer.show(), _results.push(guestPointer.setPosition(user.x, user.y))) : _results.push(this.guestPointers[user.id] = new Pointer(this.UI, user.name, user.email, !1, user.id))) : _results.push(void 0);
            return _results
        }, Mouse.prototype.clickReceived = function(id) {
            var _ref;
            return null != (_ref = this.guestPointers[id]) ? _ref.pulse() : void 0
        }, Mouse
    }(), MouseTrack = function() {
        function MouseTrack(UI) {
            this.UI = UI, this.enabled = !1, this.eventHandlers = {
                touch: function(_this) {
                    return function(event) {
                        return _this.touchEvent(event)
                    }
                }(this),
                click: function(_this) {
                    return function(event) {
                        return _this.clickEvent(event)
                    }
                }(this),
                mouse: function(_this) {
                    return function(event) {
                        return _this.mouseEvent(event)
                    }
                }(this)
            }
        }
        return MouseTrack.prototype.enable = function() {
            return !this.enabled && (this.enabled = !0, this.UI.Cwmn.logger("MouseTrack enabled"), this.UI.supportsTouch && this.UI.body.addEventListener("touchstart", this.eventHandlers.touch, !1), this.UI.supportsMouse) ? (this.UI.body.addEventListener("mousemove", this.eventHandlers.mouse, !1), this.UI.body.addEventListener("click", this.eventHandlers.click, !1)) : void 0
        }, MouseTrack.prototype.disable = function() {
            return this.enabled && (this.enabled = !1, this.UI.Cwmn.logger("MouseTrack disabled"), this.UI.supportsTouch && this.UI.body.removeEventListener("touchstart", this.eventHandlers.touch, !1), this.UI.supportsMouse) ? (this.UI.body.removeEventListener("mousemove", this.eventHandlers.mouse, !1), this.UI.body.removeEventListener("click", this.eventHandlers.click, !1)) : void 0
        }, MouseTrack.prototype.touchEvent = function() {
            return this.UI.Cwmn.Socket.trackMouse(event.touches[0].clientX, event.touches[0].clientY), this.UI.Cwmn.Socket.trackClick()
        }, MouseTrack.prototype.clickEvent = function() {
            return this.UI.Cwmn.Socket.trackClick()
        }, MouseTrack.prototype.mouseEvent = function() {
            return this.UI.Cwmn.Socket.trackMouse(event.clientX, event.clientY)
        }, MouseTrack
    }(), stringToDOM = function(str) {
        var elements, outer;
        return outer = document.createElement("div"), outer.innerHTML = str, elements = outer.childNodes, 1 === elements.length ? elements[0] : elements
    }, addChildren = function() {
        var child, children, element, _i, _len;
        for (element = arguments[0], children = 2 <= arguments.length ? __slice.call(arguments, 1) : [], _i = 0, _len = children.length; _len > _i; _i++) child = children[_i], element.appendChild(child);
        return element
    }, escape = function(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
    }, addClass = function(element, classname) {
        element.setAttribute("class", (element.className.length ? element.getAttribute("class") + " " : "") + classname)
    }, removeClass = function(element, classname) {
        var reg;
        reg = new RegExp(" *" + classname, "g"), element.setAttribute("class", element.getAttribute("class").replace(reg, ""))
    }, hasClass = function(element, className) {
        return new RegExp("(\\s|^)" + className + "(\\s|$)").test(element.className)
    }, toggleClass = function(element, className) {
        return hasClass(element, className) ? removeClass(element, className) : addClass(element, className)
    }, brandingHTML = function() {
        return stringToDOM('<div class="text-center branding"><a href="http://clickwithmenow.com" target="_blank"><img src="https://assets.clickwith.me/images/newui/logo.png" alt="Click with Me Now" class="logo"></a></div>')
    }, tabHTML = function() {
        var privateIcon, standardIcon, tab;
        return tab = stringToDOM('<a class="launch-btn" id="cwmn-launch" href="#" title="Click With Me Now"></a>'), standardIcon = stringToDOM('<img src="https://assets.clickwith.me/images/newui/ui-icon-dark.png" alt="icon" class="logo-icon">'), privateIcon = stringToDOM('<img src="https://assets.clickwith.me/images/newui/ui-icon-secure.png" alt="icon" class="logo-icon">'), [tab, standardIcon, privateIcon]
    }, sidebarContentAreaHTML = function() {
        return stringToDOM('<div id="cwmn-content"></div>')
    }, guestListHTML = function() {
        var addGuestButton, wrapper;
        return wrapper = stringToDOM('<ul class="list-group"></ul>'), addGuestButton = stringToDOM('<a href="#" class="list-group-item btn-icon btn-add"><i class="pe-7s-add-user"></i> Add Guest</a>'), wrapper.appendChild(addGuestButton), [wrapper, addGuestButton]
    }, guestRowHTML = function(name, role, isHost) {
        return null == isHost && (isHost = !1), stringToDOM('<a href="#" class="list-group-item">\n	<i class="pe-7s-' + (isHost ? "star" : "user") + '"></i> ' + escape(name) + " <small>" + escape(role) + "</small>\n</a>")
    }, guestButtonHTML = function() {
        var del, mute, star, wrapper;
        return wrapper = stringToDOM('<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel" style="min-width: 0; width: 53px"></ul>'), mute = stringToDOM('<li><a href="#"><i class="pe-7s-mute"></i></a></li>'), del = stringToDOM('<li><a href="#"><i class="pe-7s-delete-user"></i></a></li>'), star = stringToDOM('<li style="display:none"><a href="#"><i class="pe-7s-star"></i></a></li>'), addChildren(wrapper, del, star), [wrapper, mute, del, star]
    }, privacySwitchHTML = function() {
        var label, offBtn, onBtn, toggle;
        return label = stringToDOM('<label class="privacy">Privacy Mode:</label>'), toggle = stringToDOM('<div class="btn-group btn-toggle"></div>'), onBtn = stringToDOM('<button class="btn private btn-default">ON</button>'), offBtn = stringToDOM('<button class="btn open active btn-primary">OFF</button>'), toggle.appendChild(onBtn), toggle.appendChild(offBtn), [label, toggle, onBtn, offBtn]
    }, silenceGuestsLinkHTML = function() {
        return stringToDOM('<a class="text-center center-block" href="#"><i class="pe-7s-mute"></i> Silence All Guests</a>')
    }, tooltipHTML = function() {
        return stringToDOM('<div class="tooltip right"><div class="tooltip-arrow"></div><div class="tooltip-inner">Hi there. If you want to browse this site with a friend, go ahead and click that button.</div></div>')
    }, inviteToHostHTML = function() {
        var form, guestEmailField, guestEmailGroup, guestEmailLabel, guestHelpText, guestNameField, guestNameGroup, guestNameLabel, messageField, messageGroup, messageLabel;
        return form = document.createElement("form"), guestHelpText = stringToDOM('<p class="help-block">Your friend\'s info goes here:</p>'), guestNameLabel = stringToDOM('<label for="inputFriendName" class="control-label">Friend\'s Name</label>'), guestNameField = stringToDOM('<input type="text" class="form-control" id="inputFriendName" placeholder="Who should receive this?">'), guestNameGroup = addChildren(stringToDOM('<div class="form-group"></div>'), guestHelpText, guestNameLabel, guestNameField), guestEmailLabel = stringToDOM('<label for="inputFriendEmail" class="control-label">Friend\'s Email</label>'), guestEmailField = stringToDOM('<input type="email" class="form-control" id="inputFriendEmail" placeholder="where@isthisgoing.com">'), guestEmailGroup = addChildren(stringToDOM('<div class="form-group"></div>'), guestEmailLabel, guestEmailField), messageLabel = stringToDOM('<label for="textFriendMessage" class="control-label">Message</label>'), messageField = stringToDOM('<textarea class="form-control" rows="3" placeholder="Send a personal message..."></textarea>'), messageGroup = addChildren(stringToDOM('<div class="form-group"></div>'), messageLabel, messageField), addChildren(form, guestNameGroup, guestEmailGroup, messageGroup), [form, guestNameField, guestEmailField, messageField]
    }, endSessionViewHTML = function() {
        var cancel, confirm, element, heading;
        return element = stringToDOM("<div></div>"), heading = stringToDOM("<h3>Are you sure you want to end this session?</h3>"), confirm = stringToDOM('<a class="btn btn-warning btn-lg btn-block btn-icon" href=#"><i class="pe-7s-power"></i> Yes. Leave Session</a>'), cancel = stringToDOM('<a class="btn btn-default btn-lg btn-block btn-icon" href="#"><i class="pe-7s-power"></i> No. Return</a>'), addChildren(element, heading, confirm, cancel), [element, confirm, cancel]
    }, mousePointerHTML = function() {
        var dot, element, img, inner, letter, ptrImg, text, tooltip;
        return element = stringToDOM('<i class="mouse-pointer brand pulse"></i>'), letter = stringToDOM("<span></span>"), tooltip = stringToDOM('<div class="tooltip right"><div class="tooltip-arrow"></div></div>'), dot = stringToDOM('<div class="dot"></div>'), inner = stringToDOM('<div class="tooltip-inner"></div>'), img = stringToDOM('<img src="" alt="" class="gravatar">'), ptrImg = stringToDOM('<img src="" alt="" class="pointer-gravatar">'), text = stringToDOM("<span></span>"), addChildren(element, letter, ptrImg, tooltip, dot), addChildren(tooltip, inner), addChildren(inner, img, text), [element, letter, tooltip, img, ptrImg, text, dot]
    }, smsInviteViewHTML = function() {
        var form, guestNameField, guestNameGroup, guestNameLabel, smsField, smsGroup, smsLabel;
        return form = stringToDOM("<form></form>"), guestNameLabel = stringToDOM('<label for="inputFriendName" class="control-label">Friend\'s Name</label>'), guestNameField = stringToDOM('<input type="text" class="form-control" id="inputFriendName" placeholder="Who should receive this?">'), guestNameGroup = addChildren(stringToDOM('<div class="form-group"></div>'), guestNameLabel, guestNameField), smsLabel = stringToDOM('<label for="inputYourName" class="control-label">Friend\'s Phone Number</label>'), smsField = stringToDOM('<input type="tel" class="form-control" id="inputYourName" placeholder="What\'s their mobile?">'), smsGroup = addChildren(stringToDOM('<div class="form-group"></div>'), smsLabel, smsField), addChildren(form, guestNameGroup, smsGroup), [form, guestNameField, smsField]
    }, validateEmail = function(email) {
        var re;
        return re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, re.test(email)
    }
}).call(this);
var CwmnSession = function(Cwmn) {
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return null == results ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
        }
        var SessionModel = SessionModel || {},
            Session = this;
        return Session.set = function() {
            for (var obj in Cwmn.userData) "function" != typeof Cwmn.userData[obj] && sessionStorage.setItem("cwmn:" + obj, JSON.stringify(Cwmn.userData[obj]))
        }, Session.get = function() {
            if (Cwmn.logger("Getting Session Storage"), getParameterByName("cwmnScreenId")) {
            	console.debug("got here");
                var screenId = getParameterByName("cwmnScreenId"),
                    userId = getParameterByName("cwmnHostId"),
                    hostName = getParameterByName("cwmnHostName"),
                    hostEmail = getParameterByName("cwmnHostEmail"),
                    guestName = getParameterByName("cwmnGuestName"),
                    guestInviteId = (getParameterByName("cwmnGuestEmail"), getParameterByName("cwmnGuestInviteId")),
                    inviteData = {
                        size: 1
                    };
                inviteData[guestInviteId] = {
                    id: guestInviteId,
                    name: guestName,
                    screenId: screenId,
                    status: "pending",
                    link: ""
                }, sessionStorage.setItem("cwmn:screenId", JSON.stringify(screenId)), sessionStorage.setItem("cwmn:id", JSON.stringify(userId)), sessionStorage.setItem("cwmn:name", JSON.stringify(hostName)), sessionStorage.setItem("cwmn:email", JSON.stringify(hostEmail)), sessionStorage.setItem("cwmn:email", JSON.stringify(hostEmail)), sessionStorage.setItem("cwmn:inviteData", JSON.stringify(inviteData))
            }
            var key, keyCount = sessionStorage.length;
            if (keyCount > 0) {
                for (var i = 0; keyCount >= i; i++) {
                    if (key = sessionStorage.key(i)) {
                        var id = key.replace("cwmn:", "");
                        try {
                        	var key = sessionStorage.getItem(key);
                        	var jsonkey = JSON.parse(key);
                        	Cwmn.userData[id] = jsonkey;
                        } catch (err) {
                            Cwmn.logger("Unable to Fetch Session Data:"), Cwmn.logger(err.message)
                        }
                    }
                }
            }
            console.debug("Done with CwmnSession");
        }, Session.destroy = function() {
            Cwmn.logger("Destroying Session Storage"), sessionStorage.clear(), Session = null
        }, SessionModel = {
            set: Session.set,
            get: Session.get,
            destroy: Session.destroy
        }
    },
    CwmnRender = function(Cwmn) {
        {
            var RenderModel = RenderModel || {},
                Render = this;
            Cwmn.UI
        }
        return this.initialized = !1, this.locParseTimeout = 1e3, this.diffThreshold = 50, this.resizeTimeout = 1e3, this.resizeTimeoutId = null, this.parseTimeoutId = null, this.diffTimeoutId = null, this.checkImagesTimeout = 500, this.checkImagesTimeoutId = null, this.blockSize = 40, this.workers = 4, this.blockRows = 15, this.canvases = [], this.diffTime = 0, this.scrollOffset = {}, this.forceRender = !1, this.isParsing = !1, this.timeout = null, this.hasStoppedScrolling = !1, this.hasScrolled = !0, Render.domChanged = function(timeout) {
            Render.hasScrolled = !0, Render.timeout && clearTimeout(Render.timeout), Render.timeout = setTimeout(function() {
                Render.hasStoppedScrolling = !0, Render.locutus && Render.locutus.parse()
            }, timeout)
        }, Render.init = function() {
            if (!Render.initialized) {
                Cwmn.logger("Initializing rendering engine"), Render.scrollOffset = Render.getScrollOffset(), Render.Borg.init(), window.addEventListener("click", function() {
                    Render && Render.domChanged(1e3)
                });
                var aList = Array.prototype.slice.call(document.getElementsByTagName("a"));
                aList.forEach(function(e) {
                    e.addEventListener("mouseenter", function() {
                        Render && Render.domChanged(1e3)
                    }), e.addEventListener("mouseleave", function() {
                        Render && Render.domChanged(1e3)
                    })
                }), window.addEventListener("keypress", function() {
                    Render && Render.domChanged(1e3)
                }), window.addEventListener("scroll", function() {
                    Render && Render.domChanged(500)
                }), Render.initialized = !0
            }
        }, document.getElementsByTagName(".modal-dialog").onclick = function() {
            Render.domChanged(1e3)
        }, window.onresize = function() {
            clearTimeout(Render.resizeTimeoutId), Render.resizeTimeoutId = setTimeout(Render.locutus.onResize, Render.resizeTimeout)
        }, Render.getScrollOffset = function() {
            var offset_x = window.pageXOffset || document.body.scrollLeft,
                offset_y = window.pageYOffset || document.body.scrollTop;
            return {
                left: offset_x,
                top: offset_y
            }
        }, Render.offsetHasChanged = function() {
            var currentOffset = Render.getScrollOffset();
            return currentOffset.top != Render.scrollOffset.top || currentOffset.left != Render.scrollOffset.left
        }, Render.Borg = {
            init: function() {
                Cwmn.logger("Render.Borg.init");
                for (var classArr = ["locutus-skip", "cwmn-modal-overlay", "cwmn-mousetrack", "cwmn-rendered", "cwmn-faux-footer", "cwmn-footer-bar", "alertify", "alertify-cover", "alertify-logs", "engine-debug", "cwmn-debugger"], classArrLength = classArr.length, i = 0; classArrLength > i; i++)
                    for (var el = document.getElementsByClassName(classArr[i]), elArrLength = el.length, j = 0; elArrLength > j; j++) el[j].setAttribute("data-html2canvas-ignore", "true");
                Render.Borg.start()
            },
            stop: function() {
                Cwmn.logger("Stop Rendering Engine"), Render.locutus.borg && (Render.locutus.borg = null)
            },
            start: function() {
                Cwmn.logger("Start Rendering Engine"), Render.locutus.beginParse()
            }
        }, Render.locutus = {
            borg: null,
            beginParse: function() {
                Cwmn.userData.waitingForGuest = !1, Cwmn.Session.set(), Render.forceRender = !0, Render.hasStoppedScrolling = !0, Render.isParsing = !1, Render.locutus.parse()
            },
            parse: function() {
                if (Render.isParsing === !1 && Render.hasStoppedScrolling === !0) {
                    Render.hasStoppedScrolling = !1, Render.isParsing = !0, Cwmn.logger("starting parse"); {
                        (new Date).getTime()
                    }
                    Render.locutus.borg = html2canvas(document.body, {
                        onparsed: Render.locutus.onParsed,
                        logging: !1,
                        scrollToTop: !1,
                        ondiff: Render.locutus.onDiff,
                        onrendered: Render.locutus.onRendered,
                        parseTimeout: Render.locParseTimeout,
                        proxy: Cwmn.proxy,
                        reverseProxy: Cwmn.reverseProxy,
                        skipElements: ["cwmn-modal-overlay", "cwmn-mousetrack", "cwmn-rendered", "cwmn-faux-footer", "cwmn-footer-bar", "alertify", "alertify-cover", "alertify-logs", "engine-debug", "cwmn-debugger"].join("|"),
                        width: Cwmn.viewport().width || 0,
                        height: Cwmn.viewport().height || 0,
                        useCORS: !0
                    }), Render.forceRender = !0
                } else Render.locutus.onParsed();
                Render.scrollOffset = Render.getScrollOffset()
            },
            render: function() {},
            onParsed: function() {
                Render && (clearTimeout(Render.parseTimeoutId), Cwmn.userData.waitingForGuest || (Render.parseTimeoutId = setTimeout(Render.locutus.parse, Render.locParseTimeout)))
            },
            onResize: function() {
                Render && (clearTimeout(Render.resizeTimeoutId), Render.Borg.stop(), Render.Borg.start())
            },
            onDiff: function() {
                Render && (clearTimeout(Render.diffTimeoutId), Render.diffTimeoutId = setTimeout(Render.locutus.render, Render.diffThreshold))
            },
            onRendered: function(canvas) {
                var new_canvas = document.createElement("canvas"),
                    new_ctx = new_canvas.getContext("2d"),
                    old_ctx = canvas.getContext("2d");
                new_canvas.width = canvas.width, new_canvas.height = canvas.height, new_ctx.putImageData(old_ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0), Render.canvases.push(new_canvas), Render.canvases.length > 2 && Render.canvases.shift();
                JSON.stringify(Render.getScrollOffset()), JSON.stringify(Render.scrollOffset);
                Render.scrollOffset = Render.getScrollOffset(), Cwmn.Socket.passDom(canvas), Render.forceRender = !1, Render.isParsing = !1
            },
            onDiffResult: function(diff) {
                Cwmn.Socket.passDomFragment(diff)
            },
            onCanvasDiff: function() {}
        }, Render.destroy = function() {
            Cwmn.logger("Destroying Render"), window.URL && CwmnCanvasDiff.destroy(), Render.locutus.borg = null, html2canvas = null, clearTimeout(Render.locParseTimeout), clearTimeout(Render.parseTimeoutId), clearTimeout(Render.diffTimeoutId), Render = null, window.onresize = function() {}
        }, RenderModel = {
            init: Render.init,
            locutus: Render.locutus,
            destroy: Render.destroy,
            Borg: Render.Borg
        }
    },
    html2canvas, CwmnAlertify, CwmnReqwest, io, CwmnLang, Cwmn = function(options) {
        if ("object" == typeof Cwmn.instance) return Cwmn.instance;
        var Click = new loadHelpers(this),
            opts = options || {};
        return opts.debug = !0, opts.hideDebug = !0, CwmnLang = new loadLanguage(opts.lang), Click.options = {
            callbackArray: opts.callback || [],
            debug: opts.debug || !1,
            hideDebug: opts.hideDebug || (opts.debug ? !1 : !0)
        }, Click.setup = function() {
            Click.logger("Initializing CWMN"), Click.UI = new CwmnUI(Click), Click.Socket = new CwmnSocket(Click), Click.Session = new CwmnSession(Click), Click.Render = new CwmnRender(Click), Click.userData = {
                id: "",
                name: "",
                email: "",
                sessionColor: "lime-green",
                x: 0,
                y: 0,
                screenId: "",
                host: !0,
                privacy: !1,
                inviteData: {
                    size: 0
                },
                quiet: !1,
                waitingForGuest: !0,
                addInviteData: function(data) {
                    var object = {
                        id: data.inviteId || data.id,
                        name: data.guestName || data.name,
                        link: data.inviteLink || "",
                        status: "pending",
                        screenId: data.screenId,
                        hidden: data.hidden
                    };
                    return this.inviteData[object.id] = object, this.inviteData.size++, Click.Session.set(), object
                },
                removeInviteData: function(id) {
                    Click.userData.inviteData[id] && (delete Click.userData.inviteData[id], Click.userData.inviteData.size--, Click.Session.set())
                }
            }, Click.url = "https://m.clickwith.me", Click.proxy = "https://w1.clickwith.me", Click.reverseProxy = "https://w2.clickwith.me", Click.assets = "https://assets.clickwith.me", Click.utilitiesLoaded = !1, Click.imageQuality = .5, Click.screenDomain = window.location.hostname, Click.browserDetect = new CwmnBrowserDetect
        }, Click.init = function(success) {
            Click.DomLoaded(function() {
        		console.debug("init");
                Click.setup(), Click.browserDetect.hostSupported() ? (Click.loadLibraries(), Click.Session.get(), success && success()) : (Click.UI.unsupported(), success && success())
            })
        }, Click.loadWebWorker = function() {
        	console.debug("loading web worker");
            Click.loadWorker(Click.url + "/webworker", function() {
                Click.logger("WebWorker loaded")
            })
        }, Click.loadLibraries = function() {
        	console.debug("loadLibraries");
        	console.log([html2canvas]);
            if (html2canvas) {
            	Click.build()
           	}
           	else {
           		Click.logger("Loading CWMN Libraries");
           		Click.loadScript("chrome-extension://lcoijeikhmplofegbmjildgohljeapjo/common/clicklibs_2.3.2.js", function() {
                	Click.loadScriptCallback([html2canvas], Click.build, "CWMN Libs")
            	});
           	}
        }, Click.build = function() {
            Click.loadWebWorker(), Click.Session.get(), Click.userData.screenId && (Click.logger("Resuming existing session"), Click.Socket.init().then(function() {
                Click.UI.startHosting(), Click.privacy.init(), Click.userData.waitingForGuest || Click.Utilities.load()
            }))
        }, Click.sessionAPI = {
            initializeScreen: function(params, successCallback) {
                Click.logger("initialize"), params.os = Click.browserDetect.specs().os.name, params.browser_name = Click.browserDetect.specs().browser.name, params.browser_vers = Click.browserDetect.specs().browser.version, params.isHidden = Click.userData.quiet, params.domainGuid = Click.userData.domainGuid, params.existing_session = !1, params.screenDomain = Click.screenDomain, params.sessionColor = Click.userData.sessionColor, params.screenId = "", Click.ajax(Click.url + "/init?callback=?", params, function(resp) {
                    resp.error ? (Click.logger(resp), CwmnAlertify.alert("Error initializing session. Please try again later.")) : (Click.userData.id = resp.userId, Click.userData.name = resp.hostsName, Click.userData.email = resp.hostsEmail, Click.userData.screenId = resp.screenId, Click.Socket.init().then(function() {
                        successCallback()
                    }))
                }, function(err) {
                    Click.logger(err), CwmnAlertify.alert("Error initializing session. Please try again later.")
                })
            },
            emailInvite: function(params, inviteMore) {
                Click.logger("invite send");
                var inviteUrl = Click.url + (inviteMore ? "/invite/more" : "/invite") + "?callback=?";
                params.screenId = Click.userData.screenId, params.hostName = Click.userData.name, params.hostEmail = Click.userData.email, params.os = Click.browserDetect.specs().os.name, params.browser_name = Click.browserDetect.specs().browser.name, params.browser_vers = Click.browserDetect.specs().browser.version, params.isHidden = Click.userData.quiet, params.domainGuid = Click.userData.domainGuid, params.existing_session = Click.userData.existing_session, params.screenDomain = Click.screenDomain, params.sessionColor = Click.userData.sessionColor, Click.ajax(inviteUrl, params, function(resp) {
                    if (Click.logger("invite success"), resp.error) Click.logger(resp), CwmnAlertify.alert("There was an error sending the invitation. Please try again later.");
                    else {
                        Click.logger("Invite sent");
                        var inviteObj = Click.userData.addInviteData(resp);
                        Click.UI.addGuest(inviteObj)
                    }
                }, function(err) {
                    Click.logger("invite error"), Click.logger(err), CwmnAlertify.alert("There was an error sending the invitation. Please try again later.")
                })
            },
            smsInvite: function(params) {
                var inviteUrl = Click.url + "/invite/sms";
                params.screenId = Click.userData.screenId, params.hostName = Click.userData.name, params.hostEmail = Click.userData.email, params.os = Click.browserDetect.specs().os.name, params.browser_name = Click.browserDetect.specs().browser.name, params.browser_vers = Click.browserDetect.specs().browser.version, params.isHidden = Click.userData.quiet, params.domainGuid = Click.userData.domainGuid, params.existing_session = Click.userData.existing_session, params.screenDomain = Click.screenDomain, params.sessionColor = Click.userData.sessionColor, Click.ajax(inviteUrl, params, function(resp) {
                    if (Click.logger("invite success"), resp.error) Click.logger(resp), CwmnAlertify.alert("There was an error sending the invitation. Please try again later.");
                    else {
                        Click.logger("Invite sent");
                        var inviteObj = Click.userData.addInviteData(resp);
                        Click.UI.addGuest(inviteObj)
                    }
                }, function(err) {
                    Click.logger("invite error"), Click.logger(err)
                })
            },
            inviteToHost: function(params, success, error) {
                var url = Click.url + "/invite/host",
                    requestParams = {
                        hostName: params.inviteName,
                        hostEmail: params.inviteEmail,
                        guestName: params.hostName,
                        guestEmail: params.hostEmail,
                        message: params.message,
                        url: params.url,
                        os: Click.browserDetect.specs().os.name,
                        browser_name: Click.browserDetect.specs().browser.name,
                        browser_vers: Click.browserDetect.specs().browser.version,
                        screenDomain: Click.screenDomain
                    };
                Click.ajax(url, requestParams, function(response) {
                    response.error ? (Click.logger(response.error), error(response.error)) : (Click.logger(response), success(response))
                }, function(err) {
                    Click.logger(err), error()
                })
            }
        }, Click.Utilities = {
            load: function() {
                Click.logger("Utilities Being Loaded"), Click.utilitiesLoaded = !0, Click.Render.init()
            },
            unload: function() {
                Click.utilitiesLoaded = !1, clearTimeout(Click.Render.diffTimeoutId), clearTimeout(Click.Render.domRefresh)
            }
        }, Click.privacy = {
            set: function(isEnabled) {
                Click.userData.privacy = isEnabled, Click.Session.set(), Click.Socket.togglePrivacy({
                    privacy: isEnabled
                }), isEnabled ? (Click.logger("Enabling privacy"), Click.Render.Borg.stop()) : (Click.logger("Disabling privacy"), Click.Render.Borg.start())
            },
            init: function() {
                Click.privacy.set(Click.userData.privacy)
            }
        }, Click.publicLink = {
            active: !1,
            toggle: function() {
                Click.publicLink.active ? Click.publicLink.deactivate() : Click.publicLink.activate()
            },
            activate: function() {
                Click.enablePublic = active = !0, Click.Socket.publicLink(!0)
            },
            deactivate: function() {
                Click.enablePublic = active = !1, Click.Socket.publicLink(!1)
            },
            generate: function() {
                return Click.url + "/p/" + Click.userData.screenId
            }
        }, Click.callBacks = function() {
            Click.logger("callbacks"), Click.logger(Click.options.callbackArray), Click.logger("Running callback functions");
            for (var i = 0; i < Click.options.callbackArray.length; i++) {
                var fn = Click.options.callbackArray[i];
                "function" == typeof window[fn] && window[fn]()
            }
        }, Click.destroy = function() {
            Click.logger("Destroy Screen"), Click.Utilities.unload(), Click.Socket.destroy(), Click.Session.destroy(), Click.Render.destroy(), Click.UI.destroy(), Click.callBacks(), Click.removeScriptCssFile("clicklibs.js", "js"), "custom" == Click.options.startButton && Click.removeScriptCssFile("stylesheets/custom?domain=" + Click.screenDomain, "css"), CwmnInviteModal = null, delete Click.UI, delete Click.userData;
            var currentUrl = window.location.href;
            currentUrl = Click.removeParam("cwmnScreenId", currentUrl), currentUrl = Click.removeParam("cwmnHostName", currentUrl), currentUrl = Click.removeParam("cwmnHostEmail", currentUrl), currentUrl = Click.removeParam("cwmnGuestEmail", currentUrl), currentUrl = Click.removeParam("cwmnHostId", currentUrl), currentUrl = Click.removeParam("cwmnGuestName", currentUrl), currentUrl = Click.removeParam("cwmnGuestInviteId", currentUrl), window.history.pushState(null, null, currentUrl), loadCwmn()
        }, Cwmn.instance = {
            init: Click.init,
            destroy: Click.destroy,
            instance: Click
        }, Cwmn.instance
    };
loadCwmn();