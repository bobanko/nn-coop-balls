/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "48beb1e5b7bb7683d6ea"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(2)(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = distance;
/* harmony export (immutable) */ __webpack_exports__["g"] = random;
/* harmony export (immutable) */ __webpack_exports__["f"] = limit;
/* harmony export (immutable) */ __webpack_exports__["a"] = arraySum;
/* harmony export (immutable) */ __webpack_exports__["b"] = createArray;
/* harmony export (immutable) */ __webpack_exports__["c"] = createMatrix;
/* unused harmony export nf */
//todo: get from page
const jsPageHeight = 100;
/* harmony export (immutable) */ __webpack_exports__["e"] = jsPageHeight;

//todo: impl
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}
function random(min = 0, max = 1) {
    //range random
    return min + Math.random() * (max - min);
}
function limit(value, max, min) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}
function arraySum(arr) {
    return arr.reduce((sum, item) => sum + item, 0);
}
function createArray(length, value = 0) {
    return Array(length).fill(value);
}
function createMatrix(rows, cols, value = 0) {
    return createArray(rows).map(() => createArray(cols, value));
}
function nf(value, ...args) {
    return value;
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Point {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Point;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__defender__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__enemy__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__species__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__xyChart__ = __webpack_require__(6);
//import org.gicentre.utils.stat.*; //todo: charts here





function stub(...args) {
    console.warn('not impl.', args);
}
let line = stub;
let fill = stub;
let textSize = stub;
let ellipse = stub;
let background = stub;
//Global
let mutation_rate = 0.005;
let num_species = 25;
let max_acc_variation = 0.01;
let num_defenders = 6;
let num_lives = 3;
let stop = false;
let team = [];
let mafia = [];
let speciesADN = [];
let generation = 1;
let last_spawn = 1;
let frame = 1.00;
let lives = num_lives;
let species = 0;
let score = 0;
let scores = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["b" /* createArray */])(num_species);
let top_score = 0;
let top_score_gen = 0;
let last_gen_avg = 0;
let top_gen_avg = 0;
let leaderboard = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["c" /* createMatrix */])(3, 10);
let lineChart;
let medianChart;
let generation_array = [];
let history_avg = [];
let history_top = [];
let history_med = [];
let /*Table*/ table;
let evolution_end = false;
let time = performance.now();
function setupCharts() {
    lineChart = new __WEBPACK_IMPORTED_MODULE_4__xyChart__["a" /* XYChart */](this);
    // Axis formatting and labels.
    lineChart.showXAxis(true);
    lineChart.showYAxis(true);
    // Symbol colours
    lineChart.setPointSize(2);
    lineChart.setLineWidth(2);
    lineChart.setMinY(0);
    lineChart.setXAxisLabel("Generation");
    lineChart.setYFormat("###");
    lineChart.setXFormat("###");
    medianChart = new __WEBPACK_IMPORTED_MODULE_4__xyChart__["a" /* XYChart */](this);
    // Axis formatting and labels.
    medianChart.showXAxis(true);
    medianChart.showYAxis(true);
    // Symbol colours
    medianChart.setPointSize(2);
    medianChart.setLineWidth(2);
    medianChart.setMinY(0);
    medianChart.setYFormat("###");
    medianChart.setXFormat("###");
    medianChart.setXAxisLabel("Generation");
    medianChart.setLineColour('#D5A021');
    medianChart.setPointColour('#D5A021');
}
function setup() {
    //todo: set page size
    //size(1080, 720);
    let gb = document.querySelector('#gameboard');
    gb.width = 1080;
    gb.height = 720;
    let ctx = gb.getContext('2d');
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, 1080, 720);
    setupCharts();
    console.log("Generation\t|\tAverage\t|\tMedian\t|\tTop All Time");
    for (let i = 0; i < num_defenders; i++)
        team.push(new __WEBPACK_IMPORTED_MODULE_1__defender__["a" /* Defender */](i + 1, num_defenders));
    for (let i = 0; i < num_species; i++)
        speciesADN.push(new __WEBPACK_IMPORTED_MODULE_3__species__["a" /* Species */](true));
    for (let i = 0; i < 10; i++) {
        leaderboard[0][i] = 0;
        leaderboard[1][i] = 0;
        leaderboard[2][i] = 0;
    }
}
//todo: gameloop?
setInterval(() => draw(), 1000 / 30);
function draw() {
    background('#dddfd4');
    update_defenders();
    update_mafia();
    if (!evolution_end)
        mafia_spawn();
    if (score >= leaderboard[0][9]) {
        let new_entry = true;
        for (let i = 0; i < 10; i++) {
            if (leaderboard[1][i] == generation && leaderboard[2][i] == species) {
                new_entry = false;
                leaderboard[0][i] = score;
            }
        }
        if (new_entry) {
            leaderboard[0][9] = score;
            leaderboard[1][9] = generation;
            leaderboard[2][9] = species;
        }
        leaderboard = sortLeaderboard(leaderboard);
    }
    if (lives == 0) {
        lives = num_lives;
        scores[species] = score;
        top_score = Math.max(top_score, score);
        console.log(scores[species]);
        species++;
        score = 0;
        frame = 0;
        last_spawn = 0;
        reset_defenders();
        if (species == num_species) {
            //score order
            let ordered_scores = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["b" /* createArray */])(num_species);
            let ordered_speciesADN = [];
            /*new Array < Species > ()*/
            for (let i = 0; i < num_species; i++) {
                let top_score = Math.max(...scores);
                let index = 0;
                while (scores[index] != top_score)
                    index++;
                ordered_scores[i] = scores[index];
                scores[index] = -1;
                ordered_speciesADN.push(speciesADN[index]);
            }
            scores = ordered_scores;
            top_score_gen = scores[0];
            speciesADN = ordered_speciesADN;
            //new species
            let new_speciesADN = [];
            new_speciesADN.push(speciesADN[0]);
            for (let i = 1; i < num_species; i++) {
                new_speciesADN.push(newSpecies(speciesADN, scores));
            }
            speciesADN = new_speciesADN;
            let median = scores[num_species / 2];
            //reset scores
            let total_score = 0;
            for (let i = 0; i < num_species; i++) {
                total_score += scores[i];
                scores[i] = 0;
            }
            last_gen_avg = total_score / num_species;
            top_gen_avg = Math.max(top_gen_avg, last_gen_avg);
            history_avg.push(top_gen_avg);
            //history_top = append(history_top,top_score); //top all time graph
            history_top.push(top_score_gen); //top each generation graph
            history_med.push(median);
            generation_array.push(generation);
            if (generation > 7 && stop) {
                //check if end of evolution
                //if last 7 median average is greater than last median
                let sum = 0;
                for (let i = 0; i < 7; i++) {
                    sum = sum + history_med[generation - 1 - i];
                }
                let average = sum / 7;
                if (average >= history_med[generation - 1]) {
                    evolution_end = true;
                    console.log("Num of Species: " + num_species + " with mutation rate of " + mutation_rate + " got a score of " + (top_score - generation + Math.max(...history_med)));
                }
            }
            lineChart.setMaxY(top_score);
            medianChart.setMaxY(top_score);
            lineChart.setData(generation_array, history_top);
            medianChart.setData(generation_array, history_med);
            console.log(generation + "\t|\t" + last_gen_avg + "\t|\t" + median + "\t|\t" + top_score);
            generation++;
            species = 0;
        }
    }
    frame++;
    if (frame > 300)
        last_spawn++;
}
//end of draw**************************************************************************************
let text = function (value, x, y) {
    //todo: impl text write
};
function reset_defenders() {
    for (let i = team.length - 1; i >= 0; i--)
        team.splice(i, 1);
    for (let i = 0; i < num_defenders; i++)
        team.push(new __WEBPACK_IMPORTED_MODULE_1__defender__["a" /* Defender */](i + 1, num_defenders));
    for (let i = mafia.length - 1; i >= 0; i--)
        mafia.splice(i, 1);
}
function graphics() {
    //Static Graphics
    line(300, 0, 300, __WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */]);
    line(800, 0, 800, __WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */]);
    fill('#173e43');
    textSize(20);
    text("Generation " + generation, 810, 30);
    text("Species: " + (species + 1) + "/" + num_species, 810, 55);
    text("Top Score: " + top_score, 810, 80);
    textSize(22);
    text("Generation Info", 810, 115);
    text("Species Info", 810, 210);
    text("Leaderboards", 810, 285);
    textSize(18);
    text(`Average:       ${Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["a" /* arraySum */])(scores) / species}`, 810, 135); //change to 1
    text(`Last Average:  ${last_gen_avg}`, 810, 155);
    text(`Best Average:  ${top_gen_avg}`, 810, 175);
    text(`Current Score: ${score}`, 810, 230);
    text(`Lives:         ${lives}`, 810, 250);
    for (let i = 0; i < 10; i++) {
        fill('#173e43', 255 - ((generation - leaderboard[1][i]) * 7));
        if (leaderboard[1][i] == generation) {
            if (leaderboard[2][i] == species)
                fill('#D5A021');
            else
                fill('#3fb0ac');
        }
        text((i + 1) + ". Generation " + leaderboard[1][i] + ": " + leaderboard[0][i], 810, 310 + i * 21);
    }
    textSize(12);
    lineChart.draw(810, 535, 270, 175);
    medianChart.draw(810, 535, 270, 175);
}
function mafia_spawn() {
    //mafia spawn
    if (Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(1) < (last_spawn * 0.0001)) {
        let radius = (Math.exp(-frame / 20000) * 40);
        let vel = 2;
        if (frame > 10000)
            vel += frame / 10000;
        console.log(`Spawn: Radius: ${radius} Vel:${vel}   (Frame:${frame})`);
        mafia.push(new __WEBPACK_IMPORTED_MODULE_2__enemy__["a" /* Enemy */](radius, vel));
        last_spawn = 0;
    }
}
function update_mafia() {
    fill('#fae596');
    for (let i = mafia.length - 1; i >= 0; i--) {
        mafia[i].updatePos();
        if (mafia[i].intersect(team)) {
            mafia.splice(i, 1);
            score++;
        }
        else {
            let pos = mafia[i].getX();
            if (pos >= 800 - mafia[i].getRadius()) {
                mafia.splice(i, 1);
                lives--;
            }
            else if (graphics)
                ellipse(mafia[i].getX(), mafia[i].getY(), mafia[i].getRadius() * 2, mafia[i].getRadius() * 2);
        }
    }
}
function update_defenders() {
    fill('#3fb0ac');
    //update defenders
    for (let i = 0; i < team.length; i++) {
        if (graphics) {
            ellipse(team[i].getX(), team[i].getY(), team[i].getRadius() * 2, team[i].getRadius() * 2);
        }
        //calcule inputs
        let dist = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["b" /* createArray */])(team.length);
        for (let j = 0; j < team.length; j++) {
            if (j != i) {
                dist[j] = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* distance */])(team[i].getX(), team[i].getY(), team[j].getX(), team[j].getY());
            }
            else
                dist[j] = 99999;
        }
        let closest = Math.min(...dist);
        console.log("1st: " + closest);
        let index1 = 0;
        let index2 = 0;
        while (closest != dist[index1])
            index1++;
        dist[index1] = 99999;
        closest = Math.min(...dist);
        console.log("2nd: " + closest);
        while (closest != dist[index2])
            index2++;
        let input = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["b" /* createArray */])(13);
        input[0] = (team[i].getX() - 600) / 200.00; //pos x
        input[1] = (team[i].getY()) / (__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] / 2.00); //pos y
        input[2] = team[i].getVelX() / 2.00; //vel x
        input[3] = (team[i].getVelY() / 2.00); //vel y
        input[4] = ((team[index1].getX() - 600) / 200.00) - input[0];
        input[5] = ((team[index1].getY() / (__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] / 2.00))) - input[1];
        input[6] = (team[index1].getVelX() / 2.00) - input[2];
        input[7] = (team[index1].getVelY() / 2.00) - input[3];
        input[8] = ((team[index2].getX() - 600) / 200.00) - input[0];
        input[9] = ((team[index2].getY() / (__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] / 2.00))) - input[1];
        input[10] = (team[index2].getVelX() / 2.00) - input[2];
        input[11] = (team[index2].getVelY() / 2.00) - input[3];
        input[12] = 1; //bias
        console.log(`input: X:${input[0]} Y:${input[1]} VelX:${input[2]} VelY:${input[3]}`);
        let output = speciesADN[species].calculateOutput(input);
        team[i].change_acc(output[0] * max_acc_variation, output[1] * max_acc_variation);
        console.log(`X: ${team[0].getX()} Y: ${team[0].getY()}`);
    }
}
function newSpecies(ancestor, scores) {
    let baby = new __WEBPACK_IMPORTED_MODULE_3__species__["a" /* Species */](false);
    let total_score = 0;
    let float_scores = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["b" /* createArray */])(num_species);
    //normalize
    for (let i = 0; i < num_species; i++) {
        total_score += Math.pow(scores[i], 2);
    }
    for (let i = 0; i < num_species; i++) {
        float_scores[i] = (Math.pow(scores[i], 2)) / total_score;
    }
    //calculate genes
    for (let i = 0; i < 13; i++)
        for (let j = 0; j < 10; j++) {
            let r = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(0, 1);
            let index = 0;
            while (r >= 0) {
                r = r - float_scores[index];
                index++;
            }
            index--;
            let layer = ancestor[index].first_layer;
            baby.set_layer(1, i, j, layer[i][j]);
        }
    for (let i = 0; i < 11; i++)
        for (let j = 0; j < 2; j++) {
            let r = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(0, 1);
            let index = 0;
            while (r >= 0) {
                r = r - float_scores[index];
                index++;
            }
            index--;
            let layer = ancestor[index].second_layer;
            baby.set_layer(2, i, j, layer[i][j]);
        }
    //calculate mutations
    for (let i = 0; i < 13; i++)
        for (let j = 0; j < 10; j++) {
            let r = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(0, 1);
            if (r < mutation_rate)
                baby.set_layer(1, i, j, Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(-1, 1));
        }
    for (let i = 0; i < 11; i++)
        for (let j = 0; j < 2; j++) {
            let r = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(0, 1);
            if (r < mutation_rate)
                baby.set_layer(2, i, j, Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(-1, 1));
        }
    return baby;
}
function sortLeaderboard(old) {
    let sorted = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["c" /* createMatrix */])(3, 10);
    for (let i = 0; i < 10; i++) {
        let max = Math.max(...old[0]);
        let index = 0;
        while (old[0][index] != max)
            index++;
        sorted[0][i] = old[0][index];
        sorted[1][i] = old[1][index];
        sorted[2][i] = old[2][index];
        old[0][index] = -1;
    }
    return sorted;
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Point__ = __webpack_require__(1);


class Defender extends __WEBPACK_IMPORTED_MODULE_1__Point__["a" /* Point */] {
    constructor(/*int*/ current, /*int*/ total) {
        super();
        this.radius = 35;
        this.max_acc = 0.1;
        this.max_vel = 2;
        this.accX = 0;
        this.accY = 0;
        this.velX = 0;
        this.velY = 0;
        //posX = random(600+radius,800-radius);
        //posY = random(radius, jsPageHeight-radius);
        this.posX = (300 + this.radius + 800 - this.radius) / 2;
        this.posY = (__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] / total) * current;
    }
    change_acc(/*float*/ changeX, /*float*/ changeY) {
        this.accX += changeX;
        this.accY += changeY;
        this.accX = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* limit */])(this.accX, this.max_acc, -this.max_acc);
        this.accY = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* limit */])(this.accY, this.max_acc, -this.max_acc);
        this.velX += this.accX;
        this.velY += this.accY;
        this.velX = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* limit */])(this.velX, this.max_vel, -this.max_vel);
        this.velY = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* limit */])(this.velY, this.max_vel, -this.max_vel);
        this.posX += this.velX;
        this.posY += this.velY;
        this.posX = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* limit */])(this.posX, 800 - this.radius, 300 + this.radius);
        this.posY = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* limit */])(this.posY, __WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] - this.radius, this.radius);
    }
    //todo: remove getters
    /*int*/
    getRadius() {
        return this.radius;
    }
    /*int*/
    getX() {
        return this.posX;
    }
    /*int*/
    getVelY() {
        return this.velY;
    }
    /*int*/
    getVelX() {
        return this.velX;
    }
    /*int*/
    getY() {
        return this.posY;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Defender;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Point__ = __webpack_require__(1);


class Enemy extends __WEBPACK_IMPORTED_MODULE_1__Point__["a" /* Point */] {
    constructor(r, v) {
        super();
        this.radius = r;
        this.vel = v;
        this.posX = -this.radius;
        this.posY = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(this.radius, __WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] - this.radius);
    }
    updatePos() {
        this.posX += this.vel;
    }
    //todo: remove getters
    getX() {
        return this.posX;
    }
    getY() {
        return this.posY;
    }
    getRadius() {
        return this.radius;
    }
    intersect(team) {
        //todo: any
        for (let i = 0; i < team.length; i++) {
            let dist = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* distance */])(this.posX, this.posY, team[i].getX(), team[i].getY());
            if (dist < (this.radius + team[i].getRadius()))
                return true;
        }
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Enemy;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);

const hiddenNeuronsCount = 11;
const outputCount = 2;
class Species {
    constructor(isRandom) {
        //todo: layer sizes to vars
        this.first_layer = [];
        /*new float[13][10]*/
        this.second_layer = [];
        /*new float[hiddenNeuronsCount][outputCount]*/
        if (isRandom) {
            for (let /*int*/ i = 0; i < 13; i++) {
                this.first_layer[i] = [];
                for (let /*int*/ j = 0; j < 10; j++) {
                    this.first_layer[i][j] = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(-1, 1);
                }
            }
            for (let /*int*/ i = 0; i < hiddenNeuronsCount; i++) {
                this.second_layer[i] = [];
                for (let /*int*/ j = 0; j < outputCount; j++) {
                    this.second_layer[i][j] = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(-1, 1);
                }
            }
        }
    }
    calculateOutput(input) {
        let hidden = new Array(hiddenNeuronsCount).fill(0);
        let output = new Array(outputCount).fill(0);
        hidden[hiddenNeuronsCount - 1] = 1; //bias
        function activationFn(value) {
            return (2 / (1 + Math.exp(-2 * value))) - 1;
        }
        //todo: refac
        for (let i = 0; i < 10; i++)
            for (let j = 0; j < 13; j++) {
                hidden[i] += input[j] * this.first_layer[j][i];
                //activation function
                hidden[i] = activationFn(hidden[i]);
            }
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 11; j++) {
                output[i] += hidden[j] * this.second_layer[j][i];
                //activation function
                output[i] = activationFn(output[i]);
            }
        return output;
    }
    set_layer(layer, i, j, value) {
        //todo: refac
        if (layer === 1)
            this.first_layer[i][j] = value;
        if (layer === 2)
            this.second_layer[i][j] = value;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Species;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class XYChart {
    constructor(...args) {
        console.log('charts not impl');
    }
    setData(...args) {
    }
    setMinY(...args) {
    }
    setMaxY(...args) {
    }
    setMinX(...args) {
    }
    setMaxX(...args) {
    }
    showXAxis(...args) {
    }
    showYAxis(...args) {
    }
    setPointSize(...args) {
    }
    setLineWidth(...args) {
    }
    setXAxisLabel(...args) {
    }
    setYFormat(...args) {
    }
    setXFormat(...args) {
    }
    setLineColour(...args) {
    }
    setPointColour(...args) {
    }
    draw(...args) {
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = XYChart;



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDhiZWIxZTViN2JiNzY4M2Q2ZWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hlbHBlcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BvaW50LnRzIiwid2VicGFjazovLy8uL3NyYy9haV9jb29wLnRzIiwid2VicGFjazovLy8uL3NyYy9kZWZlbmRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW5lbXkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NwZWNpZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3h5Q2hhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBMkQ7QUFDM0Q7QUFDQTtBQUNBLFdBQUc7O0FBRUgsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOzs7O0FBSUE7QUFDQSxzREFBOEM7QUFDOUM7QUFDQTtBQUNBLG9DQUE0QjtBQUM1QixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQywrQ0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOENBQXNDO0FBQ3RDO0FBQ0E7QUFDQSxxQ0FBNkI7QUFDN0IscUNBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUFpQiw4QkFBOEI7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBLDREQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBbUIsMkJBQTJCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFhLDRCQUE0QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxzQkFBYyw0QkFBNEI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBYyw0QkFBNEI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHVDQUF1QztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHVDQUF1QztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUFnQixzQkFBc0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsZ0JBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQWEsd0NBQXdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0EsOENBQXNDLHVCQUF1Qjs7QUFFN0Q7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNudEJBO0FBQUEscUJBQXFCO0FBQ2QsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBQUE7QUFBQTtBQUVoQyxZQUFZO0FBQ04sa0JBQW1CLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVU7SUFDbkUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUksQ0FBQyxJQUFHLFVBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFJLENBQUMsRUFBQyxDQUFDO0FBQ3RELENBQUM7QUFFSyxnQkFBaUIsTUFBYyxDQUFDLEVBQUUsTUFBYyxDQUFDO0lBQ25ELGNBQWM7SUFDZCxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRUssZUFBZ0IsS0FBYSxFQUFFLEdBQVcsRUFBRSxHQUFXO0lBQ3pELEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7UUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7UUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUdLLGtCQUFtQixHQUFhO0lBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBR0sscUJBQXNCLE1BQWMsRUFBRSxLQUFLLEdBQUcsQ0FBQztJQUNqRCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBRUssc0JBQXVCLElBQVksRUFBRSxJQUFZLEVBQUUsS0FBSyxHQUFHLENBQUM7SUFDOUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFHSyxZQUFhLEtBQWEsRUFBRSxHQUFHLElBQUk7SUFDckMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNqQixDQUFDOzs7Ozs7OztBQ3BDSztDQUdMO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7OztBQ0hEO0FBQUEsdURBQXVEO0FBR2tEO0FBRXJFO0FBQ047QUFDSTtBQUNBO0FBR2xDLGNBQWMsR0FBRyxJQUFJO0lBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUNwQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDbkIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBR3RCLFFBQVE7QUFDUixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDMUIsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBRWpCLElBQUksSUFBSSxHQUFlLEVBQUUsQ0FBQztBQUMxQixJQUFJLEtBQUssR0FBWSxFQUFFLENBQUM7QUFDeEIsSUFBSSxVQUFVLEdBQWMsRUFBRSxDQUFDO0FBQy9CLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQztBQUN0QixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsSUFBSSxNQUFNLEdBQWEscUVBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNoRCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUNyQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDcEIsSUFBSSxXQUFXLEdBQWUsc0VBQVksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbEQsSUFBSSxTQUFrQixDQUFDO0FBQ3ZCLElBQUksV0FBb0IsQ0FBQztBQUN6QixJQUFJLGdCQUFnQixHQUFhLEVBQUUsQ0FBQztBQUNwQyxJQUFJLFdBQVcsR0FBYSxFQUFFLENBQUM7QUFDL0IsSUFBSSxXQUFXLEdBQWEsRUFBRSxDQUFDO0FBQy9CLElBQUksV0FBVyxHQUFhLEVBQUUsQ0FBQztBQUMvQixJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFFcEIsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBRTFCLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUc3QjtJQUNJLFNBQVMsR0FBRyxJQUFJLHlEQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsOEJBQThCO0lBQzlCLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixpQkFBaUI7SUFDakIsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckIsU0FBUyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN0QyxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFNUIsV0FBVyxHQUFHLElBQUkseURBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyw4QkFBOEI7SUFDOUIsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLGlCQUFpQjtJQUNqQixXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN4QyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JDLFdBQVcsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUdEO0lBQ0kscUJBQXFCO0lBQ3JCLGtCQUFrQjtJQUVsQixJQUFJLEVBQUUsR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQXNCLENBQUM7SUFFdEYsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDaEIsRUFBRSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7SUFFaEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU5QixHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztJQUN4QixHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRzNCLFdBQVcsRUFBRSxDQUFDO0lBRWQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO0lBR2xFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxFQUFFLENBQUMsRUFBRTtRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksMkRBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFFbEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFO1FBQ2hDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSx5REFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFdkMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMxQixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEIsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0FBQ0wsQ0FBQztBQUVELGlCQUFpQjtBQUNqQixXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRXJDO0lBRUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXRCLGdCQUFnQixFQUFFLENBQUM7SUFDbkIsWUFBWSxFQUFFLENBQUM7SUFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztRQUNmLFdBQVcsRUFBRSxDQUFDO0lBR2xCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztRQUNyQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxVQUFVLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ2xCLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ1osV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMxQixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO1lBQy9CLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDaEMsQ0FBQztRQUNELFdBQVcsR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FDZixDQUFDO1FBQ0csS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sRUFBRSxDQUFDO1FBQ1YsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNWLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDVixVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsZUFBZSxFQUFFLENBQUM7UUFDbEIsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxDQUMzQixDQUFDO1lBQ0csYUFBYTtZQUNiLElBQUksY0FBYyxHQUFhLHFFQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDeEQsSUFBSSxrQkFBa0IsR0FBYyxFQUFFLENBQUM7WUFDdkMsNEJBQTRCO1lBRTVCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ25DLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLFNBQVM7b0JBQzdCLEtBQUssRUFBRSxDQUFDO2dCQUNaLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFDRCxNQUFNLEdBQUcsY0FBYyxDQUFDO1lBQ3hCLGFBQWEsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsVUFBVSxHQUFHLGtCQUFrQixDQUFDO1lBQ2hDLGFBQWE7WUFDYixJQUFJLGNBQWMsR0FBYyxFQUFFLENBQUM7WUFDbkMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNuQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN4RCxDQUFDO1lBQ0QsVUFBVSxHQUFHLGNBQWMsQ0FBQztZQUM1QixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLGNBQWM7WUFDZCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDcEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDbkMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQixDQUFDO1lBQ0QsWUFBWSxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFDekMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2xELFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDOUIsbUVBQW1FO1lBQ25FLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQywyQkFBMkI7WUFDNUQsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFHbEMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN6QiwyQkFBMkI7Z0JBQzNCLHNEQUFzRDtnQkFDdEQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3pCLEdBQUcsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELENBQUM7Z0JBRUQsSUFBSSxPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDdEIsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxhQUFhLEdBQUcsSUFBSSxDQUFDO29CQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLFdBQVcsR0FBRyx5QkFBeUIsR0FBRyxhQUFhLEdBQUcsa0JBQWtCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pLLENBQUM7WUFDTCxDQUFDO1lBR0QsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QixXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQy9CLFNBQVMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDakQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUVuRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxPQUFPLEdBQUcsWUFBWSxHQUFHLE9BQU8sR0FBRyxNQUFNLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBQzFGLFVBQVUsRUFBRSxDQUFDO1lBQ2IsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUVoQixDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssRUFBRSxDQUFDO0lBQ1IsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNaLFVBQVUsRUFBRSxDQUFDO0FBRXJCLENBQUM7QUFFRCxtR0FBbUc7QUFHbkcsSUFBSSxJQUFJLEdBQUcsVUFBVSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDNUIsdUJBQXVCO0FBQzNCLENBQUMsQ0FBQztBQUVGO0lBQ0ksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLEVBQUUsQ0FBQyxFQUFFO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSwyREFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUVsRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQ7SUFDSSxpQkFBaUI7SUFDakIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLDhEQUFZLENBQUMsQ0FBQztJQUNoQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsOERBQVksQ0FBQyxDQUFDO0lBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoQixRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDYixJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsV0FBVyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvRCxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNsQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvQixJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvQixRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDYixJQUFJLENBQUMsa0JBQW1CLGtFQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsT0FBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsYUFBYTtJQUMvRSxJQUFJLENBQUMsa0JBQW1CLFlBQVksRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNsRCxJQUFJLENBQUMsa0JBQWtCLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNoRCxJQUFJLENBQUMsa0JBQWtCLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMxQyxJQUFJLENBQUMsa0JBQWtCLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUUxQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDO2dCQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEIsSUFBSTtnQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUNELElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxlQUFlLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEcsQ0FBQztJQUNELFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNiLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDbkMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRUQ7SUFDSSxhQUFhO0lBQ2IsRUFBRSxDQUFDLENBQUMsZ0VBQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNaLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDZCxHQUFHLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixNQUFNLFFBQVEsR0FBRyxhQUFhLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDdEUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLHFEQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDO0FBQ0wsQ0FBQztBQUVEO0lBQ0ksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRWhCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN6QyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkIsS0FBSyxFQUFFLENBQUM7UUFDWixDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDRixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsS0FBSyxFQUFFLENBQUM7WUFDWixDQUFDO1lBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0RyxDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUM7QUFFRDtJQUNJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoQixrQkFBa0I7SUFDbEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlGLENBQUM7UUFDRCxnQkFBZ0I7UUFDaEIsSUFBSSxJQUFJLEdBQWEscUVBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLGtFQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDdkYsQ0FBQztZQUNELElBQUk7Z0JBQ0EsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN4QixDQUFDO1FBQ0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLElBQUksTUFBTSxHQUFXLENBQUMsQ0FBQztRQUN2QixJQUFJLE1BQU0sR0FBVyxDQUFDLENBQUM7UUFDdkIsT0FBTyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMxQixNQUFNLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDckIsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQztRQUMvQixPQUFPLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzFCLE1BQU0sRUFBRSxDQUFDO1FBRWIsSUFBSSxLQUFLLEdBQWEscUVBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsT0FBTztRQUNuRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLDhEQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBTztRQUMzRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFPO1FBQzNDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxRQUFPO1FBQzdDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLDhEQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdELEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsOERBQVksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxLQUFLLENBQUMsRUFB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Q0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsT0FBTyxDQUFDLEdBQUcsSUFBSTtJQUNmLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBRyxJQUFJO0lBQ2YsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFHLElBQUk7SUFDZixDQUFDO0lBRUQsT0FBTyxDQUFDLEdBQUcsSUFBSTtJQUNmLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBRyxJQUFJO0lBQ2YsQ0FBQztJQUVELFNBQVMsQ0FBQyxHQUFHLElBQUk7SUFDakIsQ0FBQztJQUVELFNBQVMsQ0FBQyxHQUFHLElBQUk7SUFDakIsQ0FBQztJQUVELFlBQVksQ0FBQyxHQUFHLElBQUk7SUFDcEIsQ0FBQztJQUVELFlBQVksQ0FBQyxHQUFHLElBQUk7SUFDcEIsQ0FBQztJQUVELGFBQWEsQ0FBQyxHQUFHLElBQUk7SUFDckIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFHLElBQUk7SUFDbEIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFHLElBQUk7SUFDbEIsQ0FBQztJQUVELGFBQWEsQ0FBQyxHQUFHLElBQUk7SUFDckIsQ0FBQztJQUVELGNBQWMsQ0FBQyxHQUFHLElBQUk7SUFDdEIsQ0FBQztJQUVELElBQUksQ0FBQyxHQUFHLElBQUk7SUFDWixDQUFDO0NBQ0o7QUFBQTtBQUFBIiwiZmlsZSI6Ii4vZGlzdC9idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gdGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0O1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdChyZXF1ZXN0VGltZW91dCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRpZih0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiO1xyXG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcclxuIFx0XHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnIpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRcdHJlamVjdChlKTtcclxuIFx0XHRcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSh1cGRhdGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiNDhiZWIxZTViN2JiNzY4M2Q2ZWFcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9O1xyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcclxuIFx0XHJcbiBcdFx0XHQvLyBNb2R1bGUgQVBJXHJcbiBcdFx0XHRhY3RpdmU6IHRydWUsXHJcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XHJcbiBcdFx0XHRpZighdXBkYXRlKSB7XHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0XHRcdHJldHVybiBudWxsO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cclxuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxyXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxyXG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xyXG4gXHRcdFx0fSkudGhlbihcclxuIFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRcdGlmKGNiKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyciwgLy8gVE9ETyByZW1vdmUgaW4gd2VicGFjayA0XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgyKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0OGJlYjFlNWI3YmI3NjgzZDZlYSIsIi8vdG9kbzogZ2V0IGZyb20gcGFnZVxyXG5leHBvcnQgY29uc3QganNQYWdlSGVpZ2h0ID0gMTAwO1xyXG5cclxuLy90b2RvOiBpbXBsXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNYXRoLnNxcnQoKHgxIC0geDIpICoqIDIgKyAoeTEgLSB5MikgKiogMik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kb20obWluOiBudW1iZXIgPSAwLCBtYXg6IG51bWJlciA9IDEpOiBudW1iZXIge1xyXG4gICAgLy9yYW5nZSByYW5kb21cclxuICAgIHJldHVybiBtaW4gKyBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsaW1pdCh2YWx1ZTogbnVtYmVyLCBtYXg6IG51bWJlciwgbWluOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgaWYgKHZhbHVlIDwgbWluKSByZXR1cm4gbWluO1xyXG4gICAgaWYgKHZhbHVlID4gbWF4KSByZXR1cm4gbWF4O1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5U3VtKGFycjogbnVtYmVyW10pOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGFyci5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgaXRlbSwgMCk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXJyYXkobGVuZ3RoOiBudW1iZXIsIHZhbHVlID0gMCk6IG51bWJlcltdIHtcclxuICAgIHJldHVybiBBcnJheShsZW5ndGgpLmZpbGwodmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWF0cml4KHJvd3M6IG51bWJlciwgY29sczogbnVtYmVyLCB2YWx1ZSA9IDApOiBudW1iZXJbXVtdIHtcclxuICAgIHJldHVybiBjcmVhdGVBcnJheShyb3dzKS5tYXAoKCkgPT4gY3JlYXRlQXJyYXkoY29scywgdmFsdWUpKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuZih2YWx1ZTogbnVtYmVyLCAuLi5hcmdzKSB7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaGVscGVycy50cyIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQb2ludHtcclxuXHRwb3NYOiBudW1iZXI7XHJcblx0cG9zWTogbnVtYmVyO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1BvaW50LnRzIiwiLy9pbXBvcnQgb3JnLmdpY2VudHJlLnV0aWxzLnN0YXQuKjsgLy90b2RvOiBjaGFydHMgaGVyZVxyXG5cclxuXHJcbmltcG9ydCB7anNQYWdlSGVpZ2h0LCByYW5kb20sIGRpc3RhbmNlLCBsaW1pdCwgYXJyYXlTdW0sIGNyZWF0ZU1hdHJpeCwgY3JlYXRlQXJyYXksIG5mfSBmcm9tICcuL2hlbHBlcnMnO1xyXG5cclxuaW1wb3J0IHtEZWZlbmRlcn0gZnJvbSAnLi9kZWZlbmRlcic7XHJcbmltcG9ydCB7RW5lbXl9IGZyb20gJy4vZW5lbXknO1xyXG5pbXBvcnQge1NwZWNpZXN9IGZyb20gJy4vc3BlY2llcyc7XHJcbmltcG9ydCB7WFlDaGFydH0gZnJvbSAnLi94eUNoYXJ0JztcclxuXHJcblxyXG5mdW5jdGlvbiBzdHViKC4uLmFyZ3MpIHtcclxuICAgIGNvbnNvbGUud2Fybignbm90IGltcGwuJywgYXJncyk7XHJcbn1cclxuXHJcbmxldCBsaW5lID0gc3R1YjtcclxubGV0IGZpbGwgPSBzdHViO1xyXG5sZXQgdGV4dFNpemUgPSBzdHViO1xyXG5sZXQgZWxsaXBzZSA9IHN0dWI7XHJcbmxldCBiYWNrZ3JvdW5kID0gc3R1YjtcclxuXHJcblxyXG4vL0dsb2JhbFxyXG5sZXQgbXV0YXRpb25fcmF0ZSA9IDAuMDA1O1xyXG5sZXQgbnVtX3NwZWNpZXMgPSAyNTtcclxubGV0IG1heF9hY2NfdmFyaWF0aW9uID0gMC4wMTtcclxubGV0IG51bV9kZWZlbmRlcnMgPSA2O1xyXG5sZXQgbnVtX2xpdmVzID0gMztcclxubGV0IHN0b3AgPSBmYWxzZTtcclxuXHJcbmxldCB0ZWFtOiBEZWZlbmRlcltdID0gW107XHJcbmxldCBtYWZpYTogRW5lbXlbXSA9IFtdO1xyXG5sZXQgc3BlY2llc0FETjogU3BlY2llc1tdID0gW107XHJcbmxldCBnZW5lcmF0aW9uID0gMTtcclxubGV0IGxhc3Rfc3Bhd24gPSAxO1xyXG5sZXQgZnJhbWUgPSAxLjAwO1xyXG5sZXQgbGl2ZXMgPSBudW1fbGl2ZXM7XHJcbmxldCBzcGVjaWVzID0gMDtcclxubGV0IHNjb3JlID0gMDtcclxubGV0IHNjb3JlczogbnVtYmVyW10gPSBjcmVhdGVBcnJheShudW1fc3BlY2llcyk7XHJcbmxldCB0b3Bfc2NvcmUgPSAwO1xyXG5sZXQgdG9wX3Njb3JlX2dlbiA9IDA7XHJcbmxldCBsYXN0X2dlbl9hdmcgPSAwO1xyXG5sZXQgdG9wX2dlbl9hdmcgPSAwO1xyXG5sZXQgbGVhZGVyYm9hcmQ6IG51bWJlcltdW10gPSBjcmVhdGVNYXRyaXgoMywgMTApO1xyXG5sZXQgbGluZUNoYXJ0OiBYWUNoYXJ0O1xyXG5sZXQgbWVkaWFuQ2hhcnQ6IFhZQ2hhcnQ7XHJcbmxldCBnZW5lcmF0aW9uX2FycmF5OiBudW1iZXJbXSA9IFtdO1xyXG5sZXQgaGlzdG9yeV9hdmc6IG51bWJlcltdID0gW107XHJcbmxldCBoaXN0b3J5X3RvcDogbnVtYmVyW10gPSBbXTtcclxubGV0IGhpc3RvcnlfbWVkOiBudW1iZXJbXSA9IFtdO1xyXG5sZXQgLypUYWJsZSovIHRhYmxlO1xyXG5cclxubGV0IGV2b2x1dGlvbl9lbmQgPSBmYWxzZTtcclxuXHJcbmxldCB0aW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG5cclxuZnVuY3Rpb24gc2V0dXBDaGFydHMoKSB7XHJcbiAgICBsaW5lQ2hhcnQgPSBuZXcgWFlDaGFydCh0aGlzKTtcclxuICAgIC8vIEF4aXMgZm9ybWF0dGluZyBhbmQgbGFiZWxzLlxyXG4gICAgbGluZUNoYXJ0LnNob3dYQXhpcyh0cnVlKTtcclxuICAgIGxpbmVDaGFydC5zaG93WUF4aXModHJ1ZSk7XHJcbiAgICAvLyBTeW1ib2wgY29sb3Vyc1xyXG4gICAgbGluZUNoYXJ0LnNldFBvaW50U2l6ZSgyKTtcclxuICAgIGxpbmVDaGFydC5zZXRMaW5lV2lkdGgoMik7XHJcbiAgICBsaW5lQ2hhcnQuc2V0TWluWSgwKTtcclxuICAgIGxpbmVDaGFydC5zZXRYQXhpc0xhYmVsKFwiR2VuZXJhdGlvblwiKTtcclxuICAgIGxpbmVDaGFydC5zZXRZRm9ybWF0KFwiIyMjXCIpO1xyXG4gICAgbGluZUNoYXJ0LnNldFhGb3JtYXQoXCIjIyNcIik7XHJcblxyXG4gICAgbWVkaWFuQ2hhcnQgPSBuZXcgWFlDaGFydCh0aGlzKTtcclxuICAgIC8vIEF4aXMgZm9ybWF0dGluZyBhbmQgbGFiZWxzLlxyXG4gICAgbWVkaWFuQ2hhcnQuc2hvd1hBeGlzKHRydWUpO1xyXG4gICAgbWVkaWFuQ2hhcnQuc2hvd1lBeGlzKHRydWUpO1xyXG4gICAgLy8gU3ltYm9sIGNvbG91cnNcclxuICAgIG1lZGlhbkNoYXJ0LnNldFBvaW50U2l6ZSgyKTtcclxuICAgIG1lZGlhbkNoYXJ0LnNldExpbmVXaWR0aCgyKTtcclxuICAgIG1lZGlhbkNoYXJ0LnNldE1pblkoMCk7XHJcbiAgICBtZWRpYW5DaGFydC5zZXRZRm9ybWF0KFwiIyMjXCIpO1xyXG4gICAgbWVkaWFuQ2hhcnQuc2V0WEZvcm1hdChcIiMjI1wiKTtcclxuICAgIG1lZGlhbkNoYXJ0LnNldFhBeGlzTGFiZWwoXCJHZW5lcmF0aW9uXCIpO1xyXG4gICAgbWVkaWFuQ2hhcnQuc2V0TGluZUNvbG91cignI0Q1QTAyMScpO1xyXG4gICAgbWVkaWFuQ2hhcnQuc2V0UG9pbnRDb2xvdXIoJyNENUEwMjEnKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHNldHVwKCk6IHZvaWQge1xyXG4gICAgLy90b2RvOiBzZXQgcGFnZSBzaXplXHJcbiAgICAvL3NpemUoMTA4MCwgNzIwKTtcclxuXHJcbiAgICBsZXQgZ2I6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbWVib2FyZCcpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuICAgIGdiLndpZHRoID0gMTA4MDtcclxuICAgIGdiLmhlaWdodCA9IDcyMDtcclxuXHJcbiAgICBsZXQgY3R4ID0gZ2IuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICBjdHguZmlsbFN0eWxlID0gJ2dyZWVuJztcclxuICAgIGN0eC5maWxsUmVjdCgwLDAsMTA4MCw3MjApO1xyXG5cclxuXHJcbiAgICBzZXR1cENoYXJ0cygpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiR2VuZXJhdGlvblxcdHxcXHRBdmVyYWdlXFx0fFxcdE1lZGlhblxcdHxcXHRUb3AgQWxsIFRpbWVcIik7XHJcblxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX2RlZmVuZGVyczsgaSsrKVxyXG4gICAgICAgIHRlYW0ucHVzaChuZXcgRGVmZW5kZXIoaSArIDEsIG51bV9kZWZlbmRlcnMpKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9zcGVjaWVzOyBpKyspXHJcbiAgICAgICAgc3BlY2llc0FETi5wdXNoKG5ldyBTcGVjaWVzKHRydWUpKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICBsZWFkZXJib2FyZFswXVtpXSA9IDA7XHJcbiAgICAgICAgbGVhZGVyYm9hcmRbMV1baV0gPSAwO1xyXG4gICAgICAgIGxlYWRlcmJvYXJkWzJdW2ldID0gMDtcclxuICAgIH1cclxufVxyXG5cclxuLy90b2RvOiBnYW1lbG9vcD9cclxuc2V0SW50ZXJ2YWwoKCkgPT4gZHJhdygpLCAxMDAwIC8gMzApO1xyXG5cclxuZnVuY3Rpb24gZHJhdygpOiB2b2lkIHtcclxuXHJcbiAgICBiYWNrZ3JvdW5kKCcjZGRkZmQ0Jyk7XHJcblxyXG4gICAgdXBkYXRlX2RlZmVuZGVycygpO1xyXG4gICAgdXBkYXRlX21hZmlhKCk7XHJcbiAgICBpZiAoIWV2b2x1dGlvbl9lbmQpXHJcbiAgICAgICAgbWFmaWFfc3Bhd24oKTtcclxuXHJcblxyXG4gICAgaWYgKHNjb3JlID49IGxlYWRlcmJvYXJkWzBdWzldKSB7XHJcbiAgICAgICAgbGV0IG5ld19lbnRyeSA9IHRydWU7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChsZWFkZXJib2FyZFsxXVtpXSA9PSBnZW5lcmF0aW9uICYmIGxlYWRlcmJvYXJkWzJdW2ldID09IHNwZWNpZXMpIHtcclxuICAgICAgICAgICAgICAgIG5ld19lbnRyeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgbGVhZGVyYm9hcmRbMF1baV0gPSBzY29yZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3X2VudHJ5KSB7XHJcbiAgICAgICAgICAgIGxlYWRlcmJvYXJkWzBdWzldID0gc2NvcmU7XHJcbiAgICAgICAgICAgIGxlYWRlcmJvYXJkWzFdWzldID0gZ2VuZXJhdGlvbjtcclxuICAgICAgICAgICAgbGVhZGVyYm9hcmRbMl1bOV0gPSBzcGVjaWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZWFkZXJib2FyZCA9IHNvcnRMZWFkZXJib2FyZChsZWFkZXJib2FyZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGxpdmVzID09IDApIC8vZW5kIG9mIHNwZWNpZXNcclxuICAgIHtcclxuICAgICAgICBsaXZlcyA9IG51bV9saXZlcztcclxuICAgICAgICBzY29yZXNbc3BlY2llc10gPSBzY29yZTtcclxuICAgICAgICB0b3Bfc2NvcmUgPSBNYXRoLm1heCh0b3Bfc2NvcmUsIHNjb3JlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhzY29yZXNbc3BlY2llc10pO1xyXG4gICAgICAgIHNwZWNpZXMrKztcclxuICAgICAgICBzY29yZSA9IDA7XHJcbiAgICAgICAgZnJhbWUgPSAwO1xyXG4gICAgICAgIGxhc3Rfc3Bhd24gPSAwO1xyXG4gICAgICAgIHJlc2V0X2RlZmVuZGVycygpO1xyXG4gICAgICAgIGlmIChzcGVjaWVzID09IG51bV9zcGVjaWVzKSAvL2VuZCBvZiBnZW5lcmF0aW9uXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL3Njb3JlIG9yZGVyXHJcbiAgICAgICAgICAgIGxldCBvcmRlcmVkX3Njb3JlczogbnVtYmVyW10gPSBjcmVhdGVBcnJheShudW1fc3BlY2llcyk7XHJcbiAgICAgICAgICAgIGxldCBvcmRlcmVkX3NwZWNpZXNBRE46IFNwZWNpZXNbXSA9IFtdO1xyXG4gICAgICAgICAgICAvKm5ldyBBcnJheSA8IFNwZWNpZXMgPiAoKSovXHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9zcGVjaWVzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0b3Bfc2NvcmUgPSBNYXRoLm1heCguLi5zY29yZXMpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChzY29yZXNbaW5kZXhdICE9IHRvcF9zY29yZSlcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgb3JkZXJlZF9zY29yZXNbaV0gPSBzY29yZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgc2NvcmVzW2luZGV4XSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgb3JkZXJlZF9zcGVjaWVzQUROLnB1c2goc3BlY2llc0FETltpbmRleF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNjb3JlcyA9IG9yZGVyZWRfc2NvcmVzO1xyXG4gICAgICAgICAgICB0b3Bfc2NvcmVfZ2VuID0gc2NvcmVzWzBdO1xyXG4gICAgICAgICAgICBzcGVjaWVzQUROID0gb3JkZXJlZF9zcGVjaWVzQUROO1xyXG4gICAgICAgICAgICAvL25ldyBzcGVjaWVzXHJcbiAgICAgICAgICAgIGxldCBuZXdfc3BlY2llc0FETjogU3BlY2llc1tdID0gW107XHJcbiAgICAgICAgICAgIG5ld19zcGVjaWVzQUROLnB1c2goc3BlY2llc0FETlswXSk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbnVtX3NwZWNpZXM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbmV3X3NwZWNpZXNBRE4ucHVzaChuZXdTcGVjaWVzKHNwZWNpZXNBRE4sIHNjb3JlcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwZWNpZXNBRE4gPSBuZXdfc3BlY2llc0FETjtcclxuICAgICAgICAgICAgbGV0IG1lZGlhbiA9IHNjb3Jlc1tudW1fc3BlY2llcyAvIDJdO1xyXG4gICAgICAgICAgICAvL3Jlc2V0IHNjb3Jlc1xyXG4gICAgICAgICAgICBsZXQgdG90YWxfc2NvcmUgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9zcGVjaWVzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsX3Njb3JlICs9IHNjb3Jlc1tpXTtcclxuICAgICAgICAgICAgICAgIHNjb3Jlc1tpXSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGFzdF9nZW5fYXZnID0gdG90YWxfc2NvcmUgLyBudW1fc3BlY2llcztcclxuICAgICAgICAgICAgdG9wX2dlbl9hdmcgPSBNYXRoLm1heCh0b3BfZ2VuX2F2ZywgbGFzdF9nZW5fYXZnKTtcclxuICAgICAgICAgICAgaGlzdG9yeV9hdmcucHVzaCh0b3BfZ2VuX2F2Zyk7XHJcbiAgICAgICAgICAgIC8vaGlzdG9yeV90b3AgPSBhcHBlbmQoaGlzdG9yeV90b3AsdG9wX3Njb3JlKTsgLy90b3AgYWxsIHRpbWUgZ3JhcGhcclxuICAgICAgICAgICAgaGlzdG9yeV90b3AucHVzaCh0b3Bfc2NvcmVfZ2VuKTsgLy90b3AgZWFjaCBnZW5lcmF0aW9uIGdyYXBoXHJcbiAgICAgICAgICAgIGhpc3RvcnlfbWVkLnB1c2gobWVkaWFuKTtcclxuICAgICAgICAgICAgZ2VuZXJhdGlvbl9hcnJheS5wdXNoKGdlbmVyYXRpb24pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChnZW5lcmF0aW9uID4gNyAmJiBzdG9wKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NoZWNrIGlmIGVuZCBvZiBldm9sdXRpb25cclxuICAgICAgICAgICAgICAgIC8vaWYgbGFzdCA3IG1lZGlhbiBhdmVyYWdlIGlzIGdyZWF0ZXIgdGhhbiBsYXN0IG1lZGlhblxyXG4gICAgICAgICAgICAgICAgbGV0IHN1bSA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1bSA9IHN1bSArIGhpc3RvcnlfbWVkW2dlbmVyYXRpb24gLSAxIC0gaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGF2ZXJhZ2UgPSBzdW0gLyA3O1xyXG4gICAgICAgICAgICAgICAgaWYgKGF2ZXJhZ2UgPj0gaGlzdG9yeV9tZWRbZ2VuZXJhdGlvbiAtIDFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZvbHV0aW9uX2VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOdW0gb2YgU3BlY2llczogXCIgKyBudW1fc3BlY2llcyArIFwiIHdpdGggbXV0YXRpb24gcmF0ZSBvZiBcIiArIG11dGF0aW9uX3JhdGUgKyBcIiBnb3QgYSBzY29yZSBvZiBcIiArICh0b3Bfc2NvcmUgLSBnZW5lcmF0aW9uICsgTWF0aC5tYXgoLi4uaGlzdG9yeV9tZWQpKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBsaW5lQ2hhcnQuc2V0TWF4WSh0b3Bfc2NvcmUpO1xyXG4gICAgICAgICAgICBtZWRpYW5DaGFydC5zZXRNYXhZKHRvcF9zY29yZSk7XHJcbiAgICAgICAgICAgIGxpbmVDaGFydC5zZXREYXRhKGdlbmVyYXRpb25fYXJyYXksIGhpc3RvcnlfdG9wKTtcclxuICAgICAgICAgICAgbWVkaWFuQ2hhcnQuc2V0RGF0YShnZW5lcmF0aW9uX2FycmF5LCBoaXN0b3J5X21lZCk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhnZW5lcmF0aW9uICsgXCJcXHR8XFx0XCIgKyBsYXN0X2dlbl9hdmcgKyBcIlxcdHxcXHRcIiArIG1lZGlhbiArIFwiXFx0fFxcdFwiICsgdG9wX3Njb3JlKTtcclxuICAgICAgICAgICAgZ2VuZXJhdGlvbisrO1xyXG4gICAgICAgICAgICBzcGVjaWVzID0gMDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZyYW1lKys7XHJcbiAgICBpZiAoZnJhbWUgPiAzMDApXHJcbiAgICAgICAgbGFzdF9zcGF3bisrO1xyXG5cclxufVxyXG5cclxuLy9lbmQgb2YgZHJhdyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblxyXG5cclxubGV0IHRleHQgPSBmdW5jdGlvbiAodmFsdWUsIHgsIHkpIHtcclxuICAgIC8vdG9kbzogaW1wbCB0ZXh0IHdyaXRlXHJcbn07XHJcblxyXG5mdW5jdGlvbiByZXNldF9kZWZlbmRlcnMoKTogdm9pZCB7XHJcbiAgICBmb3IgKGxldCBpID0gdGVhbS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcclxuICAgICAgICB0ZWFtLnNwbGljZShpLCAxKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9kZWZlbmRlcnM7IGkrKylcclxuICAgICAgICB0ZWFtLnB1c2gobmV3IERlZmVuZGVyKGkgKyAxLCBudW1fZGVmZW5kZXJzKSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IG1hZmlhLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgICAgIG1hZmlhLnNwbGljZShpLCAxKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ3JhcGhpY3MoKTogdm9pZCB7XHJcbiAgICAvL1N0YXRpYyBHcmFwaGljc1xyXG4gICAgbGluZSgzMDAsIDAsIDMwMCwganNQYWdlSGVpZ2h0KTtcclxuICAgIGxpbmUoODAwLCAwLCA4MDAsIGpzUGFnZUhlaWdodCk7XHJcbiAgICBmaWxsKCcjMTczZTQzJyk7XHJcbiAgICB0ZXh0U2l6ZSgyMCk7XHJcbiAgICB0ZXh0KFwiR2VuZXJhdGlvbiBcIiArIGdlbmVyYXRpb24sIDgxMCwgMzApO1xyXG4gICAgdGV4dChcIlNwZWNpZXM6IFwiICsgKHNwZWNpZXMgKyAxKSArIFwiL1wiICsgbnVtX3NwZWNpZXMsIDgxMCwgNTUpO1xyXG4gICAgdGV4dChcIlRvcCBTY29yZTogXCIgKyB0b3Bfc2NvcmUsIDgxMCwgODApO1xyXG4gICAgdGV4dFNpemUoMjIpO1xyXG4gICAgdGV4dChcIkdlbmVyYXRpb24gSW5mb1wiLCA4MTAsIDExNSk7XHJcbiAgICB0ZXh0KFwiU3BlY2llcyBJbmZvXCIsIDgxMCwgMjEwKTtcclxuICAgIHRleHQoXCJMZWFkZXJib2FyZHNcIiwgODEwLCAyODUpO1xyXG4gICAgdGV4dFNpemUoMTgpO1xyXG4gICAgdGV4dChgQXZlcmFnZTogICAgICAgJHsgYXJyYXlTdW0oc2NvcmVzKSAvIHNwZWNpZXMgfWAsIDgxMCwgMTM1KTsgLy9jaGFuZ2UgdG8gMVxyXG4gICAgdGV4dChgTGFzdCBBdmVyYWdlOiAgJHsgbGFzdF9nZW5fYXZnfWAsIDgxMCwgMTU1KTtcclxuICAgIHRleHQoYEJlc3QgQXZlcmFnZTogICR7dG9wX2dlbl9hdmd9YCwgODEwLCAxNzUpO1xyXG4gICAgdGV4dChgQ3VycmVudCBTY29yZTogJHtzY29yZX1gLCA4MTAsIDIzMCk7XHJcbiAgICB0ZXh0KGBMaXZlczogICAgICAgICAke2xpdmVzfWAsIDgxMCwgMjUwKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICBmaWxsKCcjMTczZTQzJywgMjU1IC0gKChnZW5lcmF0aW9uIC0gbGVhZGVyYm9hcmRbMV1baV0pICogNykpO1xyXG4gICAgICAgIGlmIChsZWFkZXJib2FyZFsxXVtpXSA9PSBnZW5lcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChsZWFkZXJib2FyZFsyXVtpXSA9PSBzcGVjaWVzKVxyXG4gICAgICAgICAgICAgICAgZmlsbCgnI0Q1QTAyMScpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBmaWxsKCcjM2ZiMGFjJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRleHQoKGkgKyAxKSArIFwiLiBHZW5lcmF0aW9uIFwiICsgbGVhZGVyYm9hcmRbMV1baV0gKyBcIjogXCIgKyBsZWFkZXJib2FyZFswXVtpXSwgODEwLCAzMTAgKyBpICogMjEpO1xyXG4gICAgfVxyXG4gICAgdGV4dFNpemUoMTIpO1xyXG4gICAgbGluZUNoYXJ0LmRyYXcoODEwLCA1MzUsIDI3MCwgMTc1KTtcclxuICAgIG1lZGlhbkNoYXJ0LmRyYXcoODEwLCA1MzUsIDI3MCwgMTc1KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFmaWFfc3Bhd24oKTogdm9pZCB7XHJcbiAgICAvL21hZmlhIHNwYXduXHJcbiAgICBpZiAocmFuZG9tKDEpIDwgKGxhc3Rfc3Bhd24gKiAwLjAwMDEpKSB7XHJcbiAgICAgICAgbGV0IHJhZGl1cyA9IChNYXRoLmV4cCgtZnJhbWUgLyAyMDAwMCkgKiA0MCk7XHJcbiAgICAgICAgbGV0IHZlbCA9IDI7XHJcbiAgICAgICAgaWYgKGZyYW1lID4gMTAwMDApXHJcbiAgICAgICAgICAgIHZlbCArPSBmcmFtZSAvIDEwMDAwO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBTcGF3bjogUmFkaXVzOiAke3JhZGl1c30gVmVsOiR7dmVsfSAgIChGcmFtZToke2ZyYW1lfSlgKTtcclxuICAgICAgICBtYWZpYS5wdXNoKG5ldyBFbmVteShyYWRpdXMsIHZlbCkpO1xyXG4gICAgICAgIGxhc3Rfc3Bhd24gPSAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVfbWFmaWEoKTogdm9pZCB7XHJcbiAgICBmaWxsKCcjZmFlNTk2Jyk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IG1hZmlhLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgbWFmaWFbaV0udXBkYXRlUG9zKCk7XHJcbiAgICAgICAgaWYgKG1hZmlhW2ldLmludGVyc2VjdCh0ZWFtKSkge1xyXG4gICAgICAgICAgICBtYWZpYS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIHNjb3JlKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcG9zID0gbWFmaWFbaV0uZ2V0WCgpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDgwMCAtIG1hZmlhW2ldLmdldFJhZGl1cygpKSB7XHJcbiAgICAgICAgICAgICAgICBtYWZpYS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICBsaXZlcy0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGdyYXBoaWNzKVxyXG4gICAgICAgICAgICAgICAgZWxsaXBzZShtYWZpYVtpXS5nZXRYKCksIG1hZmlhW2ldLmdldFkoKSwgbWFmaWFbaV0uZ2V0UmFkaXVzKCkgKiAyLCBtYWZpYVtpXS5nZXRSYWRpdXMoKSAqIDIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlX2RlZmVuZGVycygpOiB2b2lkIHtcclxuICAgIGZpbGwoJyMzZmIwYWMnKTtcclxuICAgIC8vdXBkYXRlIGRlZmVuZGVyc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZWFtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGdyYXBoaWNzKSB7XHJcbiAgICAgICAgICAgIGVsbGlwc2UodGVhbVtpXS5nZXRYKCksIHRlYW1baV0uZ2V0WSgpLCB0ZWFtW2ldLmdldFJhZGl1cygpICogMiwgdGVhbVtpXS5nZXRSYWRpdXMoKSAqIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NhbGN1bGUgaW5wdXRzXHJcbiAgICAgICAgbGV0IGRpc3Q6IG51bWJlcltdID0gY3JlYXRlQXJyYXkodGVhbS5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGVhbS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoaiAhPSBpKSB7XHJcbiAgICAgICAgICAgICAgICBkaXN0W2pdID0gZGlzdGFuY2UodGVhbVtpXS5nZXRYKCksIHRlYW1baV0uZ2V0WSgpLCB0ZWFtW2pdLmdldFgoKSwgdGVhbVtqXS5nZXRZKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGRpc3Rbal0gPSA5OTk5OTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNsb3Nlc3QgPSBNYXRoLm1pbiguLi5kaXN0KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIjFzdDogXCIgKyBjbG9zZXN0KTtcclxuICAgICAgICBsZXQgaW5kZXgxOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBpbmRleDI6IG51bWJlciA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGNsb3Nlc3QgIT0gZGlzdFtpbmRleDFdKVxyXG4gICAgICAgICAgICBpbmRleDErKztcclxuICAgICAgICBkaXN0W2luZGV4MV0gPSA5OTk5OTtcclxuICAgICAgICBjbG9zZXN0ID0gTWF0aC5taW4oLi4uZGlzdCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCIybmQ6IFwiICsgY2xvc2VzdCk7XHJcbiAgICAgICAgd2hpbGUgKGNsb3Nlc3QgIT0gZGlzdFtpbmRleDJdKVxyXG4gICAgICAgICAgICBpbmRleDIrKztcclxuXHJcbiAgICAgICAgbGV0IGlucHV0OiBudW1iZXJbXSA9IGNyZWF0ZUFycmF5KDEzKTtcclxuICAgICAgICBpbnB1dFswXSA9ICh0ZWFtW2ldLmdldFgoKSAtIDYwMCkgLyAyMDAuMDA7IC8vcG9zIHhcclxuICAgICAgICBpbnB1dFsxXSA9ICh0ZWFtW2ldLmdldFkoKSkgLyAoanNQYWdlSGVpZ2h0IC8gMi4wMCk7Ly9wb3MgeVxyXG4gICAgICAgIGlucHV0WzJdID0gdGVhbVtpXS5nZXRWZWxYKCkgLyAyLjAwOy8vdmVsIHhcclxuICAgICAgICBpbnB1dFszXSA9ICh0ZWFtW2ldLmdldFZlbFkoKSAvIDIuMDApOy8vdmVsIHlcclxuICAgICAgICBpbnB1dFs0XSA9ICgodGVhbVtpbmRleDFdLmdldFgoKSAtIDYwMCkgLyAyMDAuMDApIC0gaW5wdXRbMF07XHJcbiAgICAgICAgaW5wdXRbNV0gPSAoKHRlYW1baW5kZXgxXS5nZXRZKCkgLyAoanNQYWdlSGVpZ2h0IC8gMi4wMCkpKSAtIGlucHV0WzFdO1xyXG4gICAgICAgIGlucHV0WzZdID0gKHRlYW1baW5kZXgxXS5nZXRWZWxYKCkgLyAyLjAwKSAtIGlucHV0WzJdO1xyXG4gICAgICAgIGlucHV0WzddID0gKHRlYW1baW5kZXgxXS5nZXRWZWxZKCkgLyAyLjAwKSAtIGlucHV0WzNdO1xyXG4gICAgICAgIGlucHV0WzhdID0gKCh0ZWFtW2luZGV4Ml0uZ2V0WCgpIC0gNjAwKSAvIDIwMC4wMCkgLSBpbnB1dFswXTtcclxuICAgICAgICBpbnB1dFs5XSA9ICgodGVhbVtpbmRleDJdLmdldFkoKSAvIChqc1BhZ2VIZWlnaHQgLyAyLjAwKSkpIC0gaW5wdXRbMV07XHJcbiAgICAgICAgaW5wdXRbMTBdID0gKHRlYW1baW5kZXgyXS5nZXRWZWxYKCkgLyAyLjAwKSAtIGlucHV0WzJdO1xyXG4gICAgICAgIGlucHV0WzExXSA9ICh0ZWFtW2luZGV4Ml0uZ2V0VmVsWSgpIC8gMi4wMCkgLSBpbnB1dFszXTtcclxuICAgICAgICBpbnB1dFsxMl0gPSAxOyAvL2JpYXNcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYGlucHV0OiBYOiR7aW5wdXRbMF19IFk6JHtpbnB1dFsxXX0gVmVsWDoke2lucHV0WzJdfSBWZWxZOiR7aW5wdXRbM119YCk7XHJcblxyXG4gICAgICAgIGxldCBvdXRwdXQ6IG51bWJlcltdID0gc3BlY2llc0FETltzcGVjaWVzXS5jYWxjdWxhdGVPdXRwdXQoaW5wdXQpO1xyXG4gICAgICAgIHRlYW1baV0uY2hhbmdlX2FjYyhvdXRwdXRbMF0gKiBtYXhfYWNjX3ZhcmlhdGlvbiwgb3V0cHV0WzFdICogbWF4X2FjY192YXJpYXRpb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBYOiAke3RlYW1bMF0uZ2V0WCgpfSBZOiAke3RlYW1bMF0uZ2V0WSgpfWApO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBuZXdTcGVjaWVzKGFuY2VzdG9yOiBTcGVjaWVzW10sIHNjb3JlczogbnVtYmVyW10pOiBTcGVjaWVzIHtcclxuICAgIGxldCBiYWJ5ID0gbmV3IFNwZWNpZXMoZmFsc2UpO1xyXG4gICAgbGV0IHRvdGFsX3Njb3JlID0gMDtcclxuICAgIGxldCBmbG9hdF9zY29yZXM6IG51bWJlcltdID0gY3JlYXRlQXJyYXkobnVtX3NwZWNpZXMpO1xyXG4gICAgLy9ub3JtYWxpemVcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX3NwZWNpZXM7IGkrKykge1xyXG4gICAgICAgIHRvdGFsX3Njb3JlICs9IHNjb3Jlc1tpXSAqKiAyO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX3NwZWNpZXM7IGkrKykge1xyXG4gICAgICAgIGZsb2F0X3Njb3Jlc1tpXSA9IChzY29yZXNbaV0gKiogMikgLyB0b3RhbF9zY29yZTtcclxuICAgIH1cclxuXHJcbiAgICAvL2NhbGN1bGF0ZSBnZW5lc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMzsgaSsrKVxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xyXG4gICAgICAgICAgICBsZXQgciA9IHJhbmRvbSgwLCAxKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKHIgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgciA9IHIgLSBmbG9hdF9zY29yZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbmRleC0tO1xyXG4gICAgICAgICAgICBsZXQgbGF5ZXI6IG51bWJlcltdW10gPSBhbmNlc3RvcltpbmRleF0uZmlyc3RfbGF5ZXI7XHJcbiAgICAgICAgICAgIGJhYnkuc2V0X2xheWVyKDEsIGksIGosIGxheWVyW2ldW2pdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMTsgaSsrKVxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMjsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCByID0gcmFuZG9tKDAsIDEpO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAociA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByID0gciAtIGZsb2F0X3Njb3Jlc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluZGV4LS07XHJcbiAgICAgICAgICAgIGxldCBsYXllcjogbnVtYmVyW11bXSA9IGFuY2VzdG9yW2luZGV4XS5zZWNvbmRfbGF5ZXI7XHJcbiAgICAgICAgICAgIGJhYnkuc2V0X2xheWVyKDIsIGksIGosIGxheWVyW2ldW2pdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgLy9jYWxjdWxhdGUgbXV0YXRpb25zXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEzOyBpKyspXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCByID0gcmFuZG9tKDAsIDEpO1xyXG4gICAgICAgICAgICBpZiAociA8IG11dGF0aW9uX3JhdGUpXHJcbiAgICAgICAgICAgICAgICBiYWJ5LnNldF9sYXllcigxLCBpLCBqLCByYW5kb20oLTEsIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMTsgaSsrKVxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMjsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCByID0gcmFuZG9tKDAsIDEpO1xyXG4gICAgICAgICAgICBpZiAociA8IG11dGF0aW9uX3JhdGUpXHJcbiAgICAgICAgICAgICAgICBiYWJ5LnNldF9sYXllcigyLCBpLCBqLCByYW5kb20oLTEsIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJhYnk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBzb3J0TGVhZGVyYm9hcmQob2xkOiBudW1iZXJbXVtdKTogbnVtYmVyW11bXSB7XHJcbiAgICBsZXQgc29ydGVkOiBudW1iZXJbXVtdID0gY3JlYXRlTWF0cml4KDMsIDEwKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICBsZXQgbWF4ID0gTWF0aC5tYXgoLi4ub2xkWzBdKTtcclxuICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgIHdoaWxlIChvbGRbMF1baW5kZXhdICE9IG1heClcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICBzb3J0ZWRbMF1baV0gPSBvbGRbMF1baW5kZXhdO1xyXG4gICAgICAgIHNvcnRlZFsxXVtpXSA9IG9sZFsxXVtpbmRleF07XHJcbiAgICAgICAgc29ydGVkWzJdW2ldID0gb2xkWzJdW2luZGV4XTtcclxuICAgICAgICBvbGRbMF1baW5kZXhdID0gLTE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc29ydGVkO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FpX2Nvb3AudHMiLCJpbXBvcnQge2pzUGFnZUhlaWdodCwgbGltaXR9IGZyb20gJy4vaGVscGVycyc7XHJcbmltcG9ydCB7UG9pbnR9IGZyb20gJy4vUG9pbnQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlZmVuZGVyIGV4dGVuZHMgUG9pbnQge1xyXG5cclxuICAgIHJhZGl1cyA9IDM1O1xyXG4gICAgbWF4X2FjYyA9IDAuMTtcclxuICAgIG1heF92ZWwgPSAyO1xyXG5cclxuICAgIGFjY1ggPSAwO1xyXG4gICAgYWNjWSA9IDA7XHJcbiAgICB2ZWxYID0gMDtcclxuICAgIHZlbFkgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKC8qaW50Ki8gY3VycmVudDogbnVtYmVyLCAvKmludCovIHRvdGFsOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vcG9zWCA9IHJhbmRvbSg2MDArcmFkaXVzLDgwMC1yYWRpdXMpO1xyXG4gICAgICAgIC8vcG9zWSA9IHJhbmRvbShyYWRpdXMsIGpzUGFnZUhlaWdodC1yYWRpdXMpO1xyXG4gICAgICAgIHRoaXMucG9zWCA9ICgzMDAgKyB0aGlzLnJhZGl1cyArIDgwMCAtIHRoaXMucmFkaXVzKSAvIDI7XHJcbiAgICAgICAgdGhpcy5wb3NZID0gKGpzUGFnZUhlaWdodCAvIHRvdGFsKSAqIGN1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlX2FjYygvKmZsb2F0Ki8gY2hhbmdlWDogbnVtYmVyLCAvKmZsb2F0Ki8gY2hhbmdlWTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hY2NYICs9IGNoYW5nZVg7XHJcbiAgICAgICAgdGhpcy5hY2NZICs9IGNoYW5nZVk7XHJcbiAgICAgICAgdGhpcy5hY2NYID0gbGltaXQodGhpcy5hY2NYLCB0aGlzLm1heF9hY2MsIC10aGlzLm1heF9hY2MpO1xyXG4gICAgICAgIHRoaXMuYWNjWSA9IGxpbWl0KHRoaXMuYWNjWSwgdGhpcy5tYXhfYWNjLCAtdGhpcy5tYXhfYWNjKTtcclxuXHJcbiAgICAgICAgdGhpcy52ZWxYICs9IHRoaXMuYWNjWDtcclxuICAgICAgICB0aGlzLnZlbFkgKz0gdGhpcy5hY2NZO1xyXG4gICAgICAgIHRoaXMudmVsWCA9IGxpbWl0KHRoaXMudmVsWCwgdGhpcy5tYXhfdmVsLCAtdGhpcy5tYXhfdmVsKTtcclxuICAgICAgICB0aGlzLnZlbFkgPSBsaW1pdCh0aGlzLnZlbFksIHRoaXMubWF4X3ZlbCwgLXRoaXMubWF4X3ZlbCk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWCArPSB0aGlzLnZlbFg7XHJcbiAgICAgICAgdGhpcy5wb3NZICs9IHRoaXMudmVsWTtcclxuICAgICAgICB0aGlzLnBvc1ggPSBsaW1pdCh0aGlzLnBvc1gsIDgwMCAtIHRoaXMucmFkaXVzLCAzMDAgKyB0aGlzLnJhZGl1cyk7XHJcbiAgICAgICAgdGhpcy5wb3NZID0gbGltaXQodGhpcy5wb3NZLCBqc1BhZ2VIZWlnaHQgLSB0aGlzLnJhZGl1cywgdGhpcy5yYWRpdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vdG9kbzogcmVtb3ZlIGdldHRlcnNcclxuICAgIC8qaW50Ki9cclxuICAgIGdldFJhZGl1cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yYWRpdXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyppbnQqL1xyXG4gICAgZ2V0WCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NYO1xyXG4gICAgfVxyXG5cclxuICAgIC8qaW50Ki9cclxuICAgIGdldFZlbFkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmVsWTtcclxuICAgIH1cclxuXHJcbiAgICAvKmludCovXHJcbiAgICBnZXRWZWxYKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZlbFg7XHJcbiAgICB9XHJcblxyXG4gICAgLyppbnQqL1xyXG4gICAgZ2V0WSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NZO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2RlZmVuZGVyLnRzIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGpzUGFnZUhlaWdodCwgcmFuZG9tIH0gZnJvbSAnLi9oZWxwZXJzJztcclxuaW1wb3J0IHsgRGVmZW5kZXIgfSBmcm9tICcuL2RlZmVuZGVyJztcclxuaW1wb3J0IHtQb2ludH0gZnJvbSAnLi9Qb2ludCc7XHJcblxyXG5leHBvcnQgY2xhc3MgRW5lbXkgZXh0ZW5kcyBQb2ludHtcclxuXHJcblx0cmFkaXVzOiBudW1iZXI7XHJcblx0dmVsOiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHI6IG51bWJlciwgdjogbnVtYmVyKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5yYWRpdXMgPSByO1xyXG5cdFx0dGhpcy52ZWwgPSB2O1xyXG5cdFx0dGhpcy5wb3NYID0gLXRoaXMucmFkaXVzO1xyXG5cdFx0dGhpcy5wb3NZID0gcmFuZG9tKHRoaXMucmFkaXVzLCBqc1BhZ2VIZWlnaHQgLSB0aGlzLnJhZGl1cyk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVQb3MoKTogdm9pZCB7XHJcblx0XHR0aGlzLnBvc1ggKz0gdGhpcy52ZWw7XHJcblx0fVxyXG5cclxuXHQvL3RvZG86IHJlbW92ZSBnZXR0ZXJzXHJcblx0Z2V0WCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMucG9zWDtcclxuXHR9XHJcblxyXG5cdGdldFkoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLnBvc1k7XHJcblx0fVxyXG5cclxuXHRnZXRSYWRpdXMoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5yYWRpdXM7XHJcblx0fVxyXG5cclxuXHRpbnRlcnNlY3QodGVhbTogQXJyYXk8RGVmZW5kZXI+KTogYm9vbGVhbiB7Ly9BcnJheUxpc3Q8ZGVmZW5kZXI+IHRlYW1cclxuXHJcblx0XHQvL3RvZG86IGFueVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0ZWFtLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBkaXN0ID0gZGlzdGFuY2UodGhpcy5wb3NYLCB0aGlzLnBvc1ksIHRlYW1baV0uZ2V0WCgpLCB0ZWFtW2ldLmdldFkoKSk7XHJcblx0XHRcdGlmIChkaXN0IDwgKHRoaXMucmFkaXVzICsgdGVhbVtpXS5nZXRSYWRpdXMoKSkpXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VuZW15LnRzIiwiaW1wb3J0IHtyYW5kb219IGZyb20gJy4vaGVscGVycyc7XHJcblxyXG5jb25zdCBoaWRkZW5OZXVyb25zQ291bnQgPSAxMTtcclxuY29uc3Qgb3V0cHV0Q291bnQgPSAyO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNwZWNpZXMge1xyXG5cclxuICAgIC8vdG9kbzogcmVmYWMgbWFrZSBzaXphYmxlP1xyXG4gICAgZmlyc3RfbGF5ZXI6IG51bWJlcltdW107XHJcbiAgICBzZWNvbmRfbGF5ZXI6IG51bWJlcltdW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoaXNSYW5kb206IGJvb2xlYW4pIHsvL2Jvb2xlYW5cclxuXHJcbiAgICAgICAgLy90b2RvOiBsYXllciBzaXplcyB0byB2YXJzXHJcbiAgICAgICAgdGhpcy5maXJzdF9sYXllciA9IFtdO1xyXG4gICAgICAgIC8qbmV3IGZsb2F0WzEzXVsxMF0qL1xyXG4gICAgICAgIHRoaXMuc2Vjb25kX2xheWVyID0gW107XHJcbiAgICAgICAgLypuZXcgZmxvYXRbaGlkZGVuTmV1cm9uc0NvdW50XVtvdXRwdXRDb3VudF0qL1xyXG5cclxuICAgICAgICBpZiAoaXNSYW5kb20pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgLyppbnQqLyBpID0gMDsgaSA8IDEzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfbGF5ZXJbaV0gPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IC8qaW50Ki8gaiA9IDA7IGogPCAxMDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdF9sYXllcltpXVtqXSA9IHJhbmRvbSgtMSwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IC8qaW50Ki8gaSA9IDA7IGkgPCBoaWRkZW5OZXVyb25zQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRfbGF5ZXJbaV0gPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IC8qaW50Ki8gaiA9IDA7IGogPCBvdXRwdXRDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRfbGF5ZXJbaV1bal0gPSByYW5kb20oLTEsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNhbGN1bGF0ZU91dHB1dChpbnB1dDogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IGhpZGRlbiA9IG5ldyBBcnJheShoaWRkZW5OZXVyb25zQ291bnQpLmZpbGwoMCk7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IG5ldyBBcnJheShvdXRwdXRDb3VudCkuZmlsbCgwKTtcclxuXHJcbiAgICAgICAgaGlkZGVuW2hpZGRlbk5ldXJvbnNDb3VudCAtIDFdID0gMTsgLy9iaWFzXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRpb25Gbih2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuICgyIC8gKDEgKyBNYXRoLmV4cCgtMiAqIHZhbHVlKSkpIC0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdG9kbzogcmVmYWNcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaGlkZGVuW2ldICs9IGlucHV0W2pdICogdGhpcy5maXJzdF9sYXllcltqXVtpXTtcclxuICAgICAgICAgICAgICAgIC8vYWN0aXZhdGlvbiBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgaGlkZGVuW2ldID0gYWN0aXZhdGlvbkZuKGhpZGRlbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTE7IGorKykge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0W2ldICs9IGhpZGRlbltqXSAqIHRoaXMuc2Vjb25kX2xheWVyW2pdW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9hY3RpdmF0aW9uIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbaV0gPSBhY3RpdmF0aW9uRm4ob3V0cHV0W2ldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldF9sYXllcihsYXllcjogbnVtYmVyLCBpOiBudW1iZXIsIGo6IG51bWJlciwgdmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIC8vdG9kbzogcmVmYWNcclxuICAgICAgICBpZiAobGF5ZXIgPT09IDEpXHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RfbGF5ZXJbaV1bal0gPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGxheWVyID09PSAyKVxyXG4gICAgICAgICAgICB0aGlzLnNlY29uZF9sYXllcltpXVtqXSA9IHZhbHVlO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NwZWNpZXMudHMiLCJleHBvcnQgY2xhc3MgWFlDaGFydCB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJ0cyBub3QgaW1wbCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1pblkoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1heFkoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1pblgoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1heFgoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dYQXhpcyguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1lBeGlzKC4uLmFyZ3MpIHtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb2ludFNpemUoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldExpbmVXaWR0aCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0WEF4aXNMYWJlbCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0WUZvcm1hdCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0WEZvcm1hdCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TGluZUNvbG91ciguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UG9pbnRDb2xvdXIoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoLi4uYXJncykge1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3h5Q2hhcnQudHMiXSwic291cmNlUm9vdCI6IiJ9