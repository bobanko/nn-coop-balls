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
/******/ 	var hotCurrentHash = "982e386e2a835bd249d8"; // eslint-disable-line no-unused-vars
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
/******/ 	return hotCreateRequire(5)(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["f"] = random;
/* harmony export (immutable) */ __webpack_exports__["e"] = limit;
/* harmony export (immutable) */ __webpack_exports__["a"] = arraySum;
/* harmony export (immutable) */ __webpack_exports__["b"] = createArray;
/* harmony export (immutable) */ __webpack_exports__["c"] = createMatrix;
//todo: get from page
const jsPageHeight = 750;
/* harmony export (immutable) */ __webpack_exports__["d"] = jsPageHeight;
 //todo: remove!
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static distance(vector1, vector2) {
        return Math.sqrt(Math.pow((vector1.x - vector2.x), 2) + Math.pow((vector1.y - vector2.y), 2));
    }
    normalize() {
        let dist = this.distance(Vector.zero);
        return this.multiply(1 / dist);
    }
    ;
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    multiply(multiplier) {
        return new Vector(this.x * multiplier, this.y * multiplier);
    }
    distance(vector) {
        return Vector.distance(this, vector);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Vector;

Vector.zero = new Vector(0, 0);
Vector.one = new Vector(1, 1);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(true);
// imports


// module
exports.push([module.i, "html,\nbody {\n  height: 100vh;\n  padding: 0;\n  margin: 0;\n}\n", "", {"version":3,"sources":["B:/Projects/nn-coop-balls/src/B:/Projects/nn-coop-balls/src/styles.less","B:/Projects/nn-coop-balls/src/styles.less"],"names":[],"mappings":"AAAA;;EACI,cAAA;EACA,WAAA;EACA,UAAA;CCEH","file":"styles.less","sourcesContent":["html,body{\n    height: 100vh;\n    padding: 0;\n    margin:0;\n}\n\nbody{\n\n}\n\n\ncanvas{\n\n}","html,\nbody {\n  height: 100vh;\n  padding: 0;\n  margin: 0;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__canvasHelper__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(1);


class Circle {
    constructor(posX, posY, radius, color) {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.color = color;
        this.velX = 0;
        this.velY = 0;
    }
    updatePos() {
        this.posX += this.velX;
        this.posY += this.velY;
    }
    draw() {
        Object(__WEBPACK_IMPORTED_MODULE_0__canvasHelper__["b" /* ellipse */])(this.posX, this.posY, this.radius, this.color);
        let velNormalized = new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* Vector */](this.velX, this.velY).normalize();
        let velDirection = velNormalized.multiply(this.radius);
        Object(__WEBPACK_IMPORTED_MODULE_0__canvasHelper__["d" /* line */])(this.posX, this.posY, this.posX + velDirection.x, this.posY + velDirection.y);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Circle;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = background;
/* harmony export (immutable) */ __webpack_exports__["d"] = line;
/* harmony export (immutable) */ __webpack_exports__["b"] = ellipse;
/* harmony export (immutable) */ __webpack_exports__["e"] = text;
/* harmony export (immutable) */ __webpack_exports__["c"] = fill;
/* harmony export (immutable) */ __webpack_exports__["f"] = textSize;
const gbSize = { width: 1080, height: 720 };
const gb = document.querySelector('#gameboard');
const ctx = gb.getContext('2d');
gb.width = gbSize.width;
gb.height = gbSize.height;
function background(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, gbSize.width, gbSize.height);
}
function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
function ellipse(x1, y1, radius, color) {
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, 2 * Math.PI, false);
    if (color) {
        ctx.fillStyle = color;
    }
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}
function text(value, x, y, size = 20) {
    //ctx.font = '20px Arial';
    //ctx.fillStyle = 'black';
    ctx.fillText(value, x, y);
}
function fill(color, alpha = 255) {
    //todo: impl alpha
    ctx.fillStyle = color;
}
function textSize(size) {
    ctx.font = `${size}px Arial`;
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__defender__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__enemy__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__species__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__xyChart__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styles_less__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styles_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__styles_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__canvasHelper__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__vector__ = __webpack_require__(1);
//import org.gicentre.utils.stat.*; //todo: charts here








//Global
let mutation_rate = 0.005;
let speciesTotal = 25; //num_species
let max_acc_variation = 0.01;
let num_defenders = 6;
let num_lives = 3;
let stop = false;
let graphicsFlag = false;
let team = [];
let mafia = [];
let speciesADN = [];
let generation = 1;
let last_spawn = 1;
let frame = 1.00;
let lives = num_lives;
let species = 0;
let score = 0;
let scores = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["b" /* createArray */])(speciesTotal);
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
    lineChart.setXAxisLabel('Generation');
    lineChart.setYFormat('###');
    lineChart.setXFormat('###');
    medianChart = new __WEBPACK_IMPORTED_MODULE_4__xyChart__["a" /* XYChart */](this);
    // Axis formatting and labels.
    medianChart.showXAxis(true);
    medianChart.showYAxis(true);
    // Symbol colours
    medianChart.setPointSize(2);
    medianChart.setLineWidth(2);
    medianChart.setMinY(0);
    medianChart.setYFormat('###');
    medianChart.setXFormat('###');
    medianChart.setXAxisLabel('Generation');
    medianChart.setLineColour('#D5A021');
    medianChart.setPointColour('#D5A021');
}
function createDefenders() {
    for (let i = 0; i < num_defenders; i++) {
        let radius = 35;
        let x = (300 + radius + 800 - radius) / 2;
        let y = (__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* jsPageHeight */] / num_defenders) * i;
        let defender = new __WEBPACK_IMPORTED_MODULE_1__defender__["a" /* Defender */](x, y);
        team.push(defender);
    }
}
function setup() {
    setupCharts();
    //console.log("Generation\t|\tAverage\t|\tMedian\t|\tTop All Time");
    createDefenders();
    for (let i = 0; i < speciesTotal; i++)
        speciesADN.push(new __WEBPACK_IMPORTED_MODULE_3__species__["a" /* Species */](true));
    for (let i = 0; i < 10; i++) {
        leaderboard[0][i] = 0;
        leaderboard[1][i] = 0;
        leaderboard[2][i] = 0;
    }
}
setup();
draw();
const SEC = 1000;
let FPS = 160;
//todo: gameloop? use RAF
setInterval(() => draw(), SEC / FPS);
function draw() {
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["a" /* background */])('#dddfd4');
    graphics();
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
    //end of species
    if (lives == 0) {
        lives = num_lives;
        scores[species] = score;
        top_score = Math.max(top_score, score);
        species++;
        score = 0;
        frame = 0;
        last_spawn = 0;
        reset_defenders();
        if (species === speciesTotal) {
            //score order
            let ordered_scores = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["b" /* createArray */])(speciesTotal);
            let ordered_speciesADN = [];
            /*new Array < Species > ()*/
            for (let i = 0; i < speciesTotal; i++) {
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
            for (let i = 1; i < speciesTotal; i++) {
                new_speciesADN.push(newSpecies(speciesADN, scores));
            }
            speciesADN = new_speciesADN;
            let median = scores[speciesTotal / 2];
            //reset scores
            let total_score = 0;
            for (let i = 0; i < speciesTotal; i++) {
                total_score += scores[i];
                scores[i] = 0;
            }
            last_gen_avg = total_score / speciesTotal;
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
                    // console.log("Num of Species: " + num_species + " with mutation rate of " + mutation_rate + " got a score of " + (top_score - generation + Math.max(...history_med)));
                }
            }
            //draw only after gen 100
            // if (generation == 100)
            //     graphicsFlag = true;
            lineChart.setMaxY(top_score);
            medianChart.setMaxY(top_score);
            lineChart.setData(generation_array, history_top);
            medianChart.setData(generation_array, history_med);
            //console.log(generation + "\t|\t" + last_gen_avg + "\t|\t" + median + "\t|\t" + top_score);
            generation++;
            species = 0;
        }
    }
    frame++;
    if (frame > 300)
        last_spawn++;
}
//end of draw**************************************************************************************
function reset_defenders() {
    for (let i = team.length - 1; i >= 0; i--)
        team.splice(i, 1);
    createDefenders();
    for (let i = mafia.length - 1; i >= 0; i--)
        mafia.splice(i, 1);
}
function graphics() {
    function renderScore(score = 0) {
        const maxScore = 3;
        return (score > maxScore)
            ? `💎x${score}`
            : ([...Array(score).fill('💎')].join('') || 0);
    }
    function renderLives(current = 0, max = num_lives) {
        return [...Array(lives).fill('💗'), ...Array(max - lives).fill('🖤')].join('');
    }
    //Static Graphics
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["d" /* line */])(300, 0, 300, __WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* jsPageHeight */]);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["d" /* line */])(800, 0, 800, __WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* jsPageHeight */]);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["c" /* fill */])('#173e43');
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["f" /* textSize */])(20);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])('Generation ' + generation, 810, 30);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])('Species: ' + (species + 1) + '/' + speciesTotal, 810, 55);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])('Top Score: ' + top_score, 810, 80);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["f" /* textSize */])(22);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])('Generation Info', 810, 115);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])('Species Info', 810, 210);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])('Leaderboards', 810, 285);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["f" /* textSize */])(18);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])(`Average:       ${Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["a" /* arraySum */])(scores) / species}`, 810, 135); //change to 1
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])(`Last Average:  ${last_gen_avg}`, 810, 155);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])(`Best Average:  ${top_gen_avg}`, 810, 175);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])(`Current Score: ${renderScore(score)}`, 810, 230);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])(`❤Lives:       ${renderLives(lives, num_lives)}`, 810, 250);
    for (let i = 0; i < 10; i++) {
        Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["c" /* fill */])('#173e43', 255 - ((generation - leaderboard[1][i]) * 7));
        if (leaderboard[1][i] == generation) {
            if (leaderboard[2][i] == species)
                Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["c" /* fill */])('#D5A021');
            else
                Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["c" /* fill */])('#3fb0ac');
        }
        Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["e" /* text */])((i + 1) + '. Generation ' + leaderboard[1][i] + ': ' + leaderboard[0][i], 810, 310 + i * 21);
    }
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["f" /* textSize */])(12);
    lineChart.draw(810, 535, 270, 175);
    medianChart.draw(810, 535, 270, 175);
}
function mafia_spawn() {
    //mafia spawn
    if (Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* random */])(0, 1) < (last_spawn * 0.0001)) {
        let radius = (Math.exp(-frame / 20000) * 40);
        let vel = 2;
        if (frame > 10000)
            vel += frame / 10000;
        //console.log(`Spawn: Radius: ${radius} Vel:${vel}   (Frame:${frame})`);
        vel = 10; //todo: remove (debug only)
        let posX = -radius;
        let posY = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* random */])(radius, __WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* jsPageHeight */] - radius);
        mafia.push(new __WEBPACK_IMPORTED_MODULE_2__enemy__["a" /* Enemy */](posX, posY, radius, vel));
        last_spawn = 0;
    }
}
function update_mafia() {
    for (let i = mafia.length - 1; i >= 0; i--) {
        mafia[i].updatePos();
        if (mafia[i].intersect(team)) {
            mafia.splice(i, 1); //delete
            score++;
            continue;
        }
        let pos = mafia[i].posX;
        if (pos >= 800 - mafia[i].radius) {
            mafia.splice(i, 1); //delete
            lives--;
            continue;
        }
        mafia[i].draw();
    }
}
function update_defenders() {
    //update defenders
    for (let i = 0; i < team.length; i++) {
        team[i].draw();
        //calcule inputs
        let dist = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["b" /* createArray */])(team.length);
        for (let j = 0; j < team.length; j++) {
            if (j != i) {
                dist[j] = __WEBPACK_IMPORTED_MODULE_7__vector__["a" /* Vector */].distance({ x: team[i].posX, y: team[i].posY }, { x: team[j].posX, y: team[j].posY });
            }
            else
                dist[j] = 99999;
        }
        let closest = Math.min(...dist);
        //console.log("1st: " + closest);
        let index1 = 0;
        let index2 = 0;
        while (closest != dist[index1])
            index1++;
        dist[index1] = 99999;
        closest = Math.min(...dist);
        //console.log("2nd: " + closest);
        while (closest != dist[index2])
            index2++;
        let input = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["b" /* createArray */])(13);
        input[0] = (team[i].posX - 600) / 200.00; //pos x
        input[1] = (team[i].posY) / (__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* jsPageHeight */] / 2.00); //pos y
        input[2] = team[i].velX / 2.00; //vel x
        input[3] = (team[i].velY / 2.00); //vel y
        input[4] = ((team[index1].posX - 600) / 200.00) - input[0];
        input[5] = ((team[index1].posY / (__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* jsPageHeight */] / 2.00))) - input[1];
        input[6] = (team[index1].velX / 2.00) - input[2];
        input[7] = (team[index1].velY / 2.00) - input[3];
        input[8] = ((team[index2].posX - 600) / 200.00) - input[0];
        input[9] = ((team[index2].posY / (__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* jsPageHeight */] / 2.00))) - input[1];
        input[10] = (team[index2].velX / 2.00) - input[2];
        input[11] = (team[index2].velY / 2.00) - input[3];
        input[12] = 1; //bias
        //console.log(`input: X:${input[0]} Y:${input[1]} VelX:${input[2]} VelY:${input[3]}`);
        let output = speciesADN[species].calculateOutput(input);
        team[i].change_acc(output[0] * max_acc_variation, output[1] * max_acc_variation);
        //console.log(`X: ${team[0].posX} Y: ${team[0].posY}`);
    }
}
function newSpecies(ancestor, scores) {
    let baby = new __WEBPACK_IMPORTED_MODULE_3__species__["a" /* Species */](false);
    let total_score = 0;
    let float_scores = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["b" /* createArray */])(speciesTotal);
    //normalize
    for (let i = 0; i < speciesTotal; i++) {
        total_score += Math.pow(scores[i], 2);
    }
    for (let i = 0; i < speciesTotal; i++) {
        float_scores[i] = (Math.pow(scores[i], 2)) / total_score;
    }
    //calculate genes
    for (let i = 0; i < 13; i++)
        for (let j = 0; j < 10; j++) {
            let r = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* random */])(0, 1);
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
            let r = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* random */])(0, 1);
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
            let r = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* random */])(0, 1);
            if (r < mutation_rate)
                baby.set_layer(1, i, j, Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* random */])(-1, 1));
        }
    for (let i = 0; i < 11; i++)
        for (let j = 0; j < 2; j++) {
            let r = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* random */])(0, 1);
            if (r < mutation_rate)
                baby.set_layer(2, i, j, Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* random */])(-1, 1));
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__circle__ = __webpack_require__(3);


const radius = 35;
const boxBounds = { start: 300, end: 800 };
const color = '#3fb0ac';
class Defender extends __WEBPACK_IMPORTED_MODULE_1__circle__["a" /* Circle */] {
    constructor(posX, posY) {
        super(posX, posY, radius, color);
        this.max_acc = 0.1;
        this.max_vel = 2;
        this.accX = 0;
        this.accY = 0;
        this.velX = 0;
        this.velY = 0;
    }
    change_acc(changeX, changeY) {
        this.accX += changeX;
        this.accY += changeY;
        this.accX = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* limit */])(this.accX, this.max_acc, -this.max_acc);
        this.accY = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* limit */])(this.accY, this.max_acc, -this.max_acc);
        this.velX += this.accX;
        this.velY += this.accY;
        this.velX = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* limit */])(this.velX, this.max_vel, -this.max_vel);
        this.velY = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* limit */])(this.velY, this.max_vel, -this.max_vel);
        super.updatePos();
        this.posX = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* limit */])(this.posX, boxBounds.end - this.radius, boxBounds.start + this.radius);
        this.posY = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* limit */])(this.posY, __WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* jsPageHeight */] - this.radius, this.radius);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Defender;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__circle__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(1);


const color = '#fae596';
class Enemy extends __WEBPACK_IMPORTED_MODULE_0__circle__["a" /* Circle */] {
    constructor(posX, posY, radius, velX) {
        super(posX, posY, radius, color);
        this.velX = velX;
    }
    intersect(team) {
        //todo: use any
        for (let i = 0; i < team.length; i++) {
            let dist = __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* Vector */].distance({ x: this.posX, y: this.posY }, { x: team[i].posX, y: team[i].posY });
            if (dist < (this.radius + team[i].radius))
                return true;
        }
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Enemy;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);

const hiddenNeuronsCount = 11;
const outputCount = 2;
class Species {
    constructor(isRandom) {
        //todo: layer sizes to vars
        this.first_layer = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["c" /* createMatrix */])(13, 10);
        this.second_layer = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["c" /* createMatrix */])(hiddenNeuronsCount, outputCount);
        if (isRandom) {
            for (let /*int*/ i = 0; i < 13; i++) {
                this.first_layer[i] = [];
                for (let /*int*/ j = 0; j < 10; j++) {
                    this.first_layer[i][j] = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* random */])(-1, 1);
                }
            }
            for (let /*int*/ i = 0; i < hiddenNeuronsCount; i++) {
                this.second_layer[i] = [];
                for (let /*int*/ j = 0; j < outputCount; j++) {
                    this.second_layer[i][j] = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["f" /* random */])(-1, 1);
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
/* 9 */
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



/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(12)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(2, function() {
			var newContent = __webpack_require__(2);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTgyZTM4NmUyYTgzNWJkMjQ5ZDgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hlbHBlcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzLmxlc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NpcmNsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2FudmFzSGVscGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9haV9jb29wLnRzIiwid2VicGFjazovLy8uL3NyYy9kZWZlbmRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW5lbXkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NwZWNpZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3h5Q2hhcnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy5sZXNzPzdkNWUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQTJEO0FBQzNEO0FBQ0E7QUFDQSxXQUFHOztBQUVILG9EQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7OztBQUlBO0FBQ0Esc0RBQThDO0FBQzlDO0FBQ0E7QUFDQSxvQ0FBNEI7QUFDNUIscUNBQTZCO0FBQzdCLHlDQUFpQzs7QUFFakMsK0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhDQUFzQztBQUN0QztBQUNBO0FBQ0EscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBaUIsOEJBQThCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQSw0REFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBa0IsY0FBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBYSw0QkFBNEI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0JBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUFnQix1Q0FBdUM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBTztRQUN4QyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLDhEQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLDhEQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUss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LENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLEtBQUssRUFBRSxDQUFDO1lBQ1QsQ0FBQztZQUNELEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxLQUFLLEdBQWUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUNyRCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7SUFFRixxQkFBcUI7SUFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzFCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLEdBQUcsZ0VBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztnQkFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxnRUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQztJQUVGLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUMxQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxHQUFHLGdFQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUM7Z0JBQ3JCLElBQUksQ0FB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QUFlLGlCQUFpQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0EsZ0NBQWdDLHNCQUFzQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBLDZCQUE2QixtQkFBbUI7O0FBRWhEOztBQUVBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiIuL2Rpc3QvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0dGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSBcclxuIFx0ZnVuY3Rpb24gd2VicGFja0hvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdFx0aWYocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0fSA7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gXHRcdHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcclxuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xyXG4gXHRcdDtcclxuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QocmVxdWVzdFRpbWVvdXQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHJlcXVlc3RUaW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQgfHwgMTAwMDA7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcclxuIFx0XHRcdFx0cmVxdWVzdC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RQYXRoLCB0cnVlKTtcclxuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQ7XHJcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkgcmV0dXJuO1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdC8vIHRpbWVvdXRcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxyXG4gXHRcdFx0XHRcdHJlc29sdmUoKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG90aGVyIGZhaWx1cmVcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm47XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjk4MmUzODZlMmE4MzViZDI0OWQ4XCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XHJcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XHJcbiBcdFxyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xyXG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXHJcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0aG90VXBkYXRlID0ge307XHJcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IDA7XHJcbiBcdFx0XHR7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9uZS1ibG9ja3NcclxuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cclxuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcclxuIFx0XHRcdHJldHVybjtcclxuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGlmKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcclxuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xyXG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XHJcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XHJcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xyXG4gXHRcdGlmKCFkZWZlcnJlZCkgcmV0dXJuO1xyXG4gXHRcdGlmKGhvdEFwcGx5T25VcGRhdGUpIHtcclxuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXHJcbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cclxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcclxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcclxuIFx0XHRcdH0pLnRoZW4oXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdCk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XHJcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiBcdFxyXG4gXHRcdHZhciBjYjtcclxuIFx0XHR2YXIgaTtcclxuIFx0XHR2YXIgajtcclxuIFx0XHR2YXIgbW9kdWxlO1xyXG4gXHRcdHZhciBtb2R1bGVJZDtcclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcclxuIFx0XHRcdFx0XHRpZDogaWRcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcclxuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fbWFpbikge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdGlmKCFwYXJlbnQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcclxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xyXG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXHJcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxyXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcclxuIFx0XHRcdH07XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XHJcbiBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XHJcbiBcdFx0XHRcdGlmKGEuaW5kZXhPZihpdGVtKSA8IDApXHJcbiBcdFx0XHRcdFx0YS5wdXNoKGl0ZW0pO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcclxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XHJcbiBcdFxyXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XHJcbiBcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCIpO1xyXG4gXHRcdH07XHJcbiBcdFxyXG4gXHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcclxuIFx0XHRcdFx0dmFyIHJlc3VsdDtcclxuIFx0XHRcdFx0aWYoaG90VXBkYXRlW2lkXSkge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcclxuIFx0XHRcdFx0aWYocmVzdWx0LmNoYWluKSB7XHJcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHN3aXRjaChyZXN1bHQudHlwZSkge1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiIGluIFwiICsgcmVzdWx0LnBhcmVudElkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGlzcG9zZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGRlZmF1bHQ6XHJcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGFib3J0RXJyb3IpIHtcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcclxuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9BcHBseSkge1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdFx0XHRcdGZvcihtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0Rpc3Bvc2UpIHtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxyXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiYgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcclxuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xyXG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xyXG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdHZhciBpZHg7XHJcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XHJcbiBcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0aWYoIW1vZHVsZSkgY29udGludWU7XHJcbiBcdFxyXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcclxuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XHJcbiBcdFx0XHRcdGNiKGRhdGEpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcclxuIFx0XHJcbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxyXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcclxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXHJcbiBcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XHJcbiBcdFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XHJcbiBcdFx0XHRcdFx0XHRpZihjYikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihjYWxsYmFja3MuaW5kZXhPZihjYikgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcclxuIFx0XHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XHJcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIyKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JnaW5hbEVycm9yOiBlcnIsIC8vIFRPRE8gcmVtb3ZlIGluIHdlYnBhY2sgNFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyMjtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcclxuIFx0XHRpZihlcnJvcikge1xyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcclxuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XHJcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoNSkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTgyZTM4NmUyYTgzNWJkMjQ5ZDgiLCIvL3RvZG86IGdldCBmcm9tIHBhZ2VcbmV4cG9ydCBjb25zdCBqc1BhZ2VIZWlnaHQgPSA3NTA7Ly90b2RvOiByZW1vdmUhXG5cbmV4cG9ydCBmdW5jdGlvbiByYW5kb20obWluOiBudW1iZXIgPSAwLCBtYXg6IG51bWJlciA9IDEpOiBudW1iZXIge1xuICAgIC8vcmFuZ2UgcmFuZG9tXG4gICAgcmV0dXJuIG1pbiArIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpbWl0KHZhbHVlOiBudW1iZXIsIG1heDogbnVtYmVyLCBtaW46IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKHZhbHVlIDwgbWluKSByZXR1cm4gbWluO1xuICAgIGlmICh2YWx1ZSA+IG1heCkgcmV0dXJuIG1heDtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5U3VtKGFycjogbnVtYmVyW10pOiBudW1iZXIge1xuICAgIHJldHVybiBhcnIucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIGl0ZW0sIDApO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcnJheShsZW5ndGg6IG51bWJlciwgdmFsdWUgPSAwKTogbnVtYmVyW10ge1xuICAgIHJldHVybiBBcnJheShsZW5ndGgpLmZpbGwodmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWF0cml4KHJvd3M6IG51bWJlciwgY29sczogbnVtYmVyLCB2YWx1ZSA9IDApOiBudW1iZXJbXVtdIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXkocm93cykubWFwKCgpID0+IGNyZWF0ZUFycmF5KGNvbHMsIHZhbHVlKSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaGVscGVycy50cyIsInR5cGUgVFZlY3RvciA9IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcbmV4cG9ydCBjbGFzcyBWZWN0b3Ige1xuXHRzdGF0aWMgemVybyA9IG5ldyBWZWN0b3IoMCwgMCk7XG5cdHN0YXRpYyBvbmUgPSBuZXcgVmVjdG9yKDEsIDEpO1xuXG5cdHN0YXRpYyBkaXN0YW5jZSh2ZWN0b3IxOiBUVmVjdG9yLCB2ZWN0b3IyOiBUVmVjdG9yKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KCh2ZWN0b3IxLnggLSB2ZWN0b3IyLngpICoqIDIgKyAodmVjdG9yMS55IC0gdmVjdG9yMi55KSAqKiAyKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKHB1YmxpYyB4OiBudW1iZXIgPSAwLCBwdWJsaWMgeTogbnVtYmVyID0gMCkge1xuXG5cdH1cblxuXHRub3JtYWxpemUoKTogVmVjdG9yIHtcblx0XHRsZXQgZGlzdCA9IHRoaXMuZGlzdGFuY2UoVmVjdG9yLnplcm8pO1xuXHRcdHJldHVybiB0aGlzLm11bHRpcGx5KDEgLyBkaXN0KTtcblx0fTtcblxuXHRhZGQodmVjdG9yOiBUVmVjdG9yKTogVmVjdG9yIHtcblx0XHRyZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKyB2ZWN0b3IueCwgdGhpcy55ICsgdmVjdG9yLnkpO1xuXHR9XG5cblx0bXVsdGlwbHkobXVsdGlwbGllcjogbnVtYmVyKTogVmVjdG9yIHtcblx0XHRyZXR1cm4gbmV3IFZlY3Rvcih0aGlzLnggKiBtdWx0aXBsaWVyLCB0aGlzLnkgKiBtdWx0aXBsaWVyKTtcblx0fVxuXG5cdGRpc3RhbmNlKHZlY3RvcjogVFZlY3Rvcik6IG51bWJlciB7XG5cdFx0cmV0dXJuIFZlY3Rvci5kaXN0YW5jZSh0aGlzLCB2ZWN0b3IpO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdmVjdG9yLnRzIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh0cnVlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImh0bWwsXFxuYm9keSB7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgcGFkZGluZzogMDtcXG4gIG1hcmdpbjogMDtcXG59XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkI6L1Byb2plY3RzL25uLWNvb3AtYmFsbHMvc3JjL0I6L1Byb2plY3RzL25uLWNvb3AtYmFsbHMvc3JjL3N0eWxlcy5sZXNzXCIsXCJCOi9Qcm9qZWN0cy9ubi1jb29wLWJhbGxzL3NyYy9zdHlsZXMubGVzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7RUFDSSxjQUFBO0VBQ0EsV0FBQTtFQUNBLFVBQUE7Q0NFSFwiLFwiZmlsZVwiOlwic3R5bGVzLmxlc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiaHRtbCxib2R5e1xcbiAgICBoZWlnaHQ6IDEwMHZoO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBtYXJnaW46MDtcXG59XFxuXFxuYm9keXtcXG5cXG59XFxuXFxuXFxuY2FudmFze1xcblxcbn1cIixcImh0bWwsXFxuYm9keSB7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgcGFkZGluZzogMDtcXG4gIG1hcmdpbjogMDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvbGliL2xvYWRlci5qcz97XCJzb3VyY2VNYXBcIjp0cnVlfSEuL3NyYy9zdHlsZXMubGVzc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge2VsbGlwc2UsIGxpbmV9IGZyb20gJy4vY2FudmFzSGVscGVyJztcbmltcG9ydCB7VmVjdG9yfSBmcm9tICcuL3ZlY3Rvcic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDaXJjbGUge1xuXG5cdHZlbFg6IG51bWJlciA9IDA7XG5cdHZlbFk6IG51bWJlciA9IDA7XG5cblx0Y29uc3RydWN0b3IocHVibGljIHBvc1g6IG51bWJlciwgcHVibGljIHBvc1k6IG51bWJlcixcblx0XHRcdFx0cHVibGljIHJhZGl1czogbnVtYmVyLFxuXHRcdFx0XHRwdWJsaWMgY29sb3I6IHN0cmluZykge1xuXG5cdH1cblxuXHR1cGRhdGVQb3MoKSB7XG5cdFx0dGhpcy5wb3NYICs9IHRoaXMudmVsWDtcblx0XHR0aGlzLnBvc1kgKz0gdGhpcy52ZWxZO1xuXHR9XG5cblx0ZHJhdygpIHtcblx0XHRlbGxpcHNlKHRoaXMucG9zWCwgdGhpcy5wb3NZLCB0aGlzLnJhZGl1cywgdGhpcy5jb2xvcik7XG5cdFx0bGV0IHZlbE5vcm1hbGl6ZWQgPSBuZXcgVmVjdG9yKHRoaXMudmVsWCwgdGhpcy52ZWxZKS5ub3JtYWxpemUoKTtcblx0XHRsZXQgdmVsRGlyZWN0aW9uID0gdmVsTm9ybWFsaXplZC5tdWx0aXBseSh0aGlzLnJhZGl1cyk7XG5cblx0XHRsaW5lKHRoaXMucG9zWCwgdGhpcy5wb3NZLCB0aGlzLnBvc1ggKyB2ZWxEaXJlY3Rpb24ueCwgdGhpcy5wb3NZICsgdmVsRGlyZWN0aW9uLnkpO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2lyY2xlLnRzIiwiY29uc3QgZ2JTaXplID0ge3dpZHRoOiAxMDgwLCBoZWlnaHQ6IDcyMH07XHJcbmNvbnN0IGdiOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lYm9hcmQnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuY29uc3QgY3R4ID0gZ2IuZ2V0Q29udGV4dCgnMmQnKTtcclxuZ2Iud2lkdGggPSBnYlNpemUud2lkdGg7XHJcbmdiLmhlaWdodCA9IGdiU2l6ZS5oZWlnaHQ7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYmFja2dyb3VuZChjb2xvcjogc3RyaW5nKSB7XHJcblx0Y3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG5cdGN0eC5maWxsUmVjdCgwLCAwLCBnYlNpemUud2lkdGgsIGdiU2l6ZS5oZWlnaHQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGluZSh4MSwgeTEsIHgyLCB5Mikge1xyXG5cdGN0eC5iZWdpblBhdGgoKTtcclxuXHRjdHgubW92ZVRvKHgxLCB5MSk7XHJcblx0Y3R4LmxpbmVUbyh4MiwgeTIpO1xyXG5cdGN0eC5zdHJva2UoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVsbGlwc2UoeDEsIHkxLCByYWRpdXMsIGNvbG9yPykge1xyXG5cdGN0eC5iZWdpblBhdGgoKTtcclxuXHRjdHguYXJjKHgxLCB5MSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG5cclxuXHRpZiAoY29sb3IpIHtcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuXHR9XHJcblxyXG5cdGN0eC5maWxsKCk7XHJcblx0Y3R4LmxpbmVXaWR0aCA9IDM7XHJcblx0Y3R4LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcclxuXHRjdHguc3Ryb2tlKCk7XHJcblx0Y3R4LmNsb3NlUGF0aCgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGV4dCh2YWx1ZSwgeCwgeSwgc2l6ZSA9IDIwKSB7XHJcblx0Ly9jdHguZm9udCA9ICcyMHB4IEFyaWFsJztcclxuXHQvL2N0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG5cdGN0eC5maWxsVGV4dCh2YWx1ZSwgeCwgeSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWxsKGNvbG9yLCBhbHBoYSA9IDI1NSkge1xyXG5cdC8vdG9kbzogaW1wbCBhbHBoYVxyXG5cdGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRleHRTaXplKHNpemUpIHtcclxuXHRjdHguZm9udCA9IGAke3NpemV9cHggQXJpYWxgO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NhbnZhc0hlbHBlci50cyIsIi8vaW1wb3J0IG9yZy5naWNlbnRyZS51dGlscy5zdGF0Lio7IC8vdG9kbzogY2hhcnRzIGhlcmVcblxuXG5pbXBvcnQge2FycmF5U3VtLCBjcmVhdGVBcnJheSwgY3JlYXRlTWF0cml4LCBqc1BhZ2VIZWlnaHQsIHJhbmRvbX0gZnJvbSAnLi9oZWxwZXJzJztcblxuaW1wb3J0IHtEZWZlbmRlcn0gZnJvbSAnLi9kZWZlbmRlcic7XG5pbXBvcnQge0VuZW15fSBmcm9tICcuL2VuZW15JztcbmltcG9ydCB7U3BlY2llc30gZnJvbSAnLi9zcGVjaWVzJztcbmltcG9ydCB7WFlDaGFydH0gZnJvbSAnLi94eUNoYXJ0JztcblxuaW1wb3J0ICcuL3N0eWxlcy5sZXNzJztcbmltcG9ydCB7YmFja2dyb3VuZCwgZmlsbCwgbGluZSwgdGV4dCwgdGV4dFNpemV9IGZyb20gJy4vY2FudmFzSGVscGVyJztcbmltcG9ydCB7VmVjdG9yfSBmcm9tICcuL3ZlY3Rvcic7XG5cblxuLy9HbG9iYWxcbmxldCBtdXRhdGlvbl9yYXRlID0gMC4wMDU7XG5sZXQgc3BlY2llc1RvdGFsID0gMjU7Ly9udW1fc3BlY2llc1xubGV0IG1heF9hY2NfdmFyaWF0aW9uID0gMC4wMTtcbmxldCBudW1fZGVmZW5kZXJzID0gNjtcbmxldCBudW1fbGl2ZXMgPSAzO1xubGV0IHN0b3AgPSBmYWxzZTtcblxubGV0IGdyYXBoaWNzRmxhZyA9IGZhbHNlO1xuXG5sZXQgdGVhbTogRGVmZW5kZXJbXSA9IFtdO1xubGV0IG1hZmlhOiBFbmVteVtdID0gW107XG5sZXQgc3BlY2llc0FETjogU3BlY2llc1tdID0gW107XG5sZXQgZ2VuZXJhdGlvbiA9IDE7XG5sZXQgbGFzdF9zcGF3biA9IDE7XG5sZXQgZnJhbWUgPSAxLjAwO1xubGV0IGxpdmVzID0gbnVtX2xpdmVzO1xubGV0IHNwZWNpZXMgPSAwO1xubGV0IHNjb3JlID0gMDtcbmxldCBzY29yZXM6IG51bWJlcltdID0gY3JlYXRlQXJyYXkoc3BlY2llc1RvdGFsKTtcbmxldCB0b3Bfc2NvcmUgPSAwO1xubGV0IHRvcF9zY29yZV9nZW4gPSAwO1xubGV0IGxhc3RfZ2VuX2F2ZyA9IDA7XG5sZXQgdG9wX2dlbl9hdmcgPSAwO1xubGV0IGxlYWRlcmJvYXJkOiBudW1iZXJbXVtdID0gY3JlYXRlTWF0cml4KDMsIDEwKTtcbmxldCBsaW5lQ2hhcnQ6IFhZQ2hhcnQ7XG5sZXQgbWVkaWFuQ2hhcnQ6IFhZQ2hhcnQ7XG5sZXQgZ2VuZXJhdGlvbl9hcnJheTogbnVtYmVyW10gPSBbXTtcbmxldCBoaXN0b3J5X2F2ZzogbnVtYmVyW10gPSBbXTtcbmxldCBoaXN0b3J5X3RvcDogbnVtYmVyW10gPSBbXTtcbmxldCBoaXN0b3J5X21lZDogbnVtYmVyW10gPSBbXTtcbmxldCAvKlRhYmxlKi8gdGFibGU7XG5cbmxldCBldm9sdXRpb25fZW5kID0gZmFsc2U7XG5cbmxldCB0aW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cblxuZnVuY3Rpb24gc2V0dXBDaGFydHMoKSB7XG5cdGxpbmVDaGFydCA9IG5ldyBYWUNoYXJ0KHRoaXMpO1xuXHQvLyBBeGlzIGZvcm1hdHRpbmcgYW5kIGxhYmVscy5cblx0bGluZUNoYXJ0LnNob3dYQXhpcyh0cnVlKTtcblx0bGluZUNoYXJ0LnNob3dZQXhpcyh0cnVlKTtcblx0Ly8gU3ltYm9sIGNvbG91cnNcblx0bGluZUNoYXJ0LnNldFBvaW50U2l6ZSgyKTtcblx0bGluZUNoYXJ0LnNldExpbmVXaWR0aCgyKTtcblx0bGluZUNoYXJ0LnNldE1pblkoMCk7XG5cdGxpbmVDaGFydC5zZXRYQXhpc0xhYmVsKCdHZW5lcmF0aW9uJyk7XG5cdGxpbmVDaGFydC5zZXRZRm9ybWF0KCcjIyMnKTtcblx0bGluZUNoYXJ0LnNldFhGb3JtYXQoJyMjIycpO1xuXG5cdG1lZGlhbkNoYXJ0ID0gbmV3IFhZQ2hhcnQodGhpcyk7XG5cdC8vIEF4aXMgZm9ybWF0dGluZyBhbmQgbGFiZWxzLlxuXHRtZWRpYW5DaGFydC5zaG93WEF4aXModHJ1ZSk7XG5cdG1lZGlhbkNoYXJ0LnNob3dZQXhpcyh0cnVlKTtcblx0Ly8gU3ltYm9sIGNvbG91cnNcblx0bWVkaWFuQ2hhcnQuc2V0UG9pbnRTaXplKDIpO1xuXHRtZWRpYW5DaGFydC5zZXRMaW5lV2lkdGgoMik7XG5cdG1lZGlhbkNoYXJ0LnNldE1pblkoMCk7XG5cdG1lZGlhbkNoYXJ0LnNldFlGb3JtYXQoJyMjIycpO1xuXHRtZWRpYW5DaGFydC5zZXRYRm9ybWF0KCcjIyMnKTtcblx0bWVkaWFuQ2hhcnQuc2V0WEF4aXNMYWJlbCgnR2VuZXJhdGlvbicpO1xuXHRtZWRpYW5DaGFydC5zZXRMaW5lQ29sb3VyKCcjRDVBMDIxJyk7XG5cdG1lZGlhbkNoYXJ0LnNldFBvaW50Q29sb3VyKCcjRDVBMDIxJyk7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlRGVmZW5kZXJzKCkge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bV9kZWZlbmRlcnM7IGkrKykge1xuXG5cdFx0bGV0IHJhZGl1cyA9IDM1O1xuXHRcdGxldCB4ID0gKDMwMCArIHJhZGl1cyArIDgwMCAtIHJhZGl1cykgLyAyO1xuXHRcdGxldCB5ID0gKGpzUGFnZUhlaWdodCAvIG51bV9kZWZlbmRlcnMpICogaTtcblxuXHRcdGxldCBkZWZlbmRlciA9IG5ldyBEZWZlbmRlcih4LCB5KTtcblx0XHR0ZWFtLnB1c2goZGVmZW5kZXIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldHVwKCk6IHZvaWQge1xuXG5cdHNldHVwQ2hhcnRzKCk7XG5cblx0Ly9jb25zb2xlLmxvZyhcIkdlbmVyYXRpb25cXHR8XFx0QXZlcmFnZVxcdHxcXHRNZWRpYW5cXHR8XFx0VG9wIEFsbCBUaW1lXCIpO1xuXHRjcmVhdGVEZWZlbmRlcnMoKTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHNwZWNpZXNUb3RhbDsgaSsrKVxuXHRcdHNwZWNpZXNBRE4ucHVzaChuZXcgU3BlY2llcyh0cnVlKSk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0bGVhZGVyYm9hcmRbMF1baV0gPSAwO1xuXHRcdGxlYWRlcmJvYXJkWzFdW2ldID0gMDtcblx0XHRsZWFkZXJib2FyZFsyXVtpXSA9IDA7XG5cdH1cbn1cblxuc2V0dXAoKTtcbmRyYXcoKTtcbmNvbnN0IFNFQyA9IDEwMDA7XG5sZXQgRlBTID0gMTYwO1xuLy90b2RvOiBnYW1lbG9vcD8gdXNlIFJBRlxuc2V0SW50ZXJ2YWwoKCkgPT4gZHJhdygpLCBTRUMgLyBGUFMpO1xuXG5mdW5jdGlvbiBkcmF3KCk6IHZvaWQge1xuXHRiYWNrZ3JvdW5kKCcjZGRkZmQ0Jyk7XG5cblx0Z3JhcGhpY3MoKTtcblxuXHR1cGRhdGVfZGVmZW5kZXJzKCk7XG5cdHVwZGF0ZV9tYWZpYSgpO1xuXHRpZiAoIWV2b2x1dGlvbl9lbmQpXG5cdFx0bWFmaWFfc3Bhd24oKTtcblxuXG5cdGlmIChzY29yZSA+PSBsZWFkZXJib2FyZFswXVs5XSkge1xuXHRcdGxldCBuZXdfZW50cnkgPSB0cnVlO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0aWYgKGxlYWRlcmJvYXJkWzFdW2ldID09IGdlbmVyYXRpb24gJiYgbGVhZGVyYm9hcmRbMl1baV0gPT0gc3BlY2llcykge1xuXHRcdFx0XHRuZXdfZW50cnkgPSBmYWxzZTtcblx0XHRcdFx0bGVhZGVyYm9hcmRbMF1baV0gPSBzY29yZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKG5ld19lbnRyeSkge1xuXHRcdFx0bGVhZGVyYm9hcmRbMF1bOV0gPSBzY29yZTtcblx0XHRcdGxlYWRlcmJvYXJkWzFdWzldID0gZ2VuZXJhdGlvbjtcblx0XHRcdGxlYWRlcmJvYXJkWzJdWzldID0gc3BlY2llcztcblx0XHR9XG5cdFx0bGVhZGVyYm9hcmQgPSBzb3J0TGVhZGVyYm9hcmQobGVhZGVyYm9hcmQpO1xuXHR9XG5cblx0Ly9lbmQgb2Ygc3BlY2llc1xuXHRpZiAobGl2ZXMgPT0gMCkge1xuXHRcdGxpdmVzID0gbnVtX2xpdmVzO1xuXHRcdHNjb3Jlc1tzcGVjaWVzXSA9IHNjb3JlO1xuXHRcdHRvcF9zY29yZSA9IE1hdGgubWF4KHRvcF9zY29yZSwgc2NvcmUpO1xuXHRcdHNwZWNpZXMrKztcblxuXHRcdHNjb3JlID0gMDtcblx0XHRmcmFtZSA9IDA7XG5cdFx0bGFzdF9zcGF3biA9IDA7XG5cdFx0cmVzZXRfZGVmZW5kZXJzKCk7XG5cdFx0aWYgKHNwZWNpZXMgPT09IHNwZWNpZXNUb3RhbCkgLy9lbmQgb2YgZ2VuZXJhdGlvblxuXHRcdHtcblx0XHRcdC8vc2NvcmUgb3JkZXJcblx0XHRcdGxldCBvcmRlcmVkX3Njb3JlczogbnVtYmVyW10gPSBjcmVhdGVBcnJheShzcGVjaWVzVG90YWwpO1xuXHRcdFx0bGV0IG9yZGVyZWRfc3BlY2llc0FETjogU3BlY2llc1tdID0gW107XG5cdFx0XHQvKm5ldyBBcnJheSA8IFNwZWNpZXMgPiAoKSovXG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3BlY2llc1RvdGFsOyBpKyspIHtcblx0XHRcdFx0bGV0IHRvcF9zY29yZSA9IE1hdGgubWF4KC4uLnNjb3Jlcyk7XG5cdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdHdoaWxlIChzY29yZXNbaW5kZXhdICE9IHRvcF9zY29yZSlcblx0XHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0XHRvcmRlcmVkX3Njb3Jlc1tpXSA9IHNjb3Jlc1tpbmRleF07XG5cdFx0XHRcdHNjb3Jlc1tpbmRleF0gPSAtMTtcblx0XHRcdFx0b3JkZXJlZF9zcGVjaWVzQUROLnB1c2goc3BlY2llc0FETltpbmRleF0pO1xuXHRcdFx0fVxuXHRcdFx0c2NvcmVzID0gb3JkZXJlZF9zY29yZXM7XG5cdFx0XHR0b3Bfc2NvcmVfZ2VuID0gc2NvcmVzWzBdO1xuXHRcdFx0c3BlY2llc0FETiA9IG9yZGVyZWRfc3BlY2llc0FETjtcblx0XHRcdC8vbmV3IHNwZWNpZXNcblx0XHRcdGxldCBuZXdfc3BlY2llc0FETjogU3BlY2llc1tdID0gW107XG5cdFx0XHRuZXdfc3BlY2llc0FETi5wdXNoKHNwZWNpZXNBRE5bMF0pO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBzcGVjaWVzVG90YWw7IGkrKykge1xuXHRcdFx0XHRuZXdfc3BlY2llc0FETi5wdXNoKG5ld1NwZWNpZXMoc3BlY2llc0FETiwgc2NvcmVzKSk7XG5cdFx0XHR9XG5cdFx0XHRzcGVjaWVzQUROID0gbmV3X3NwZWNpZXNBRE47XG5cdFx0XHRsZXQgbWVkaWFuID0gc2NvcmVzW3NwZWNpZXNUb3RhbCAvIDJdO1xuXHRcdFx0Ly9yZXNldCBzY29yZXNcblx0XHRcdGxldCB0b3RhbF9zY29yZSA9IDA7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNwZWNpZXNUb3RhbDsgaSsrKSB7XG5cdFx0XHRcdHRvdGFsX3Njb3JlICs9IHNjb3Jlc1tpXTtcblx0XHRcdFx0c2NvcmVzW2ldID0gMDtcblx0XHRcdH1cblx0XHRcdGxhc3RfZ2VuX2F2ZyA9IHRvdGFsX3Njb3JlIC8gc3BlY2llc1RvdGFsO1xuXHRcdFx0dG9wX2dlbl9hdmcgPSBNYXRoLm1heCh0b3BfZ2VuX2F2ZywgbGFzdF9nZW5fYXZnKTtcblx0XHRcdGhpc3RvcnlfYXZnLnB1c2godG9wX2dlbl9hdmcpO1xuXHRcdFx0Ly9oaXN0b3J5X3RvcCA9IGFwcGVuZChoaXN0b3J5X3RvcCx0b3Bfc2NvcmUpOyAvL3RvcCBhbGwgdGltZSBncmFwaFxuXHRcdFx0aGlzdG9yeV90b3AucHVzaCh0b3Bfc2NvcmVfZ2VuKTsgLy90b3AgZWFjaCBnZW5lcmF0aW9uIGdyYXBoXG5cdFx0XHRoaXN0b3J5X21lZC5wdXNoKG1lZGlhbik7XG5cdFx0XHRnZW5lcmF0aW9uX2FycmF5LnB1c2goZ2VuZXJhdGlvbik7XG5cblxuXHRcdFx0aWYgKGdlbmVyYXRpb24gPiA3ICYmIHN0b3ApIHtcblx0XHRcdFx0Ly9jaGVjayBpZiBlbmQgb2YgZXZvbHV0aW9uXG5cdFx0XHRcdC8vaWYgbGFzdCA3IG1lZGlhbiBhdmVyYWdlIGlzIGdyZWF0ZXIgdGhhbiBsYXN0IG1lZGlhblxuXHRcdFx0XHRsZXQgc3VtID0gMDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcblx0XHRcdFx0XHRzdW0gPSBzdW0gKyBoaXN0b3J5X21lZFtnZW5lcmF0aW9uIC0gMSAtIGldO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGF2ZXJhZ2UgPSBzdW0gLyA3O1xuXHRcdFx0XHRpZiAoYXZlcmFnZSA+PSBoaXN0b3J5X21lZFtnZW5lcmF0aW9uIC0gMV0pIHtcblx0XHRcdFx0XHRldm9sdXRpb25fZW5kID0gdHJ1ZTtcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIk51bSBvZiBTcGVjaWVzOiBcIiArIG51bV9zcGVjaWVzICsgXCIgd2l0aCBtdXRhdGlvbiByYXRlIG9mIFwiICsgbXV0YXRpb25fcmF0ZSArIFwiIGdvdCBhIHNjb3JlIG9mIFwiICsgKHRvcF9zY29yZSAtIGdlbmVyYXRpb24gKyBNYXRoLm1heCguLi5oaXN0b3J5X21lZCkpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvL2RyYXcgb25seSBhZnRlciBnZW4gMTAwXG5cdFx0XHQvLyBpZiAoZ2VuZXJhdGlvbiA9PSAxMDApXG5cdFx0XHQvLyAgICAgZ3JhcGhpY3NGbGFnID0gdHJ1ZTtcblxuXHRcdFx0bGluZUNoYXJ0LnNldE1heFkodG9wX3Njb3JlKTtcblx0XHRcdG1lZGlhbkNoYXJ0LnNldE1heFkodG9wX3Njb3JlKTtcblx0XHRcdGxpbmVDaGFydC5zZXREYXRhKGdlbmVyYXRpb25fYXJyYXksIGhpc3RvcnlfdG9wKTtcblx0XHRcdG1lZGlhbkNoYXJ0LnNldERhdGEoZ2VuZXJhdGlvbl9hcnJheSwgaGlzdG9yeV9tZWQpO1xuXG5cdFx0XHQvL2NvbnNvbGUubG9nKGdlbmVyYXRpb24gKyBcIlxcdHxcXHRcIiArIGxhc3RfZ2VuX2F2ZyArIFwiXFx0fFxcdFwiICsgbWVkaWFuICsgXCJcXHR8XFx0XCIgKyB0b3Bfc2NvcmUpO1xuXHRcdFx0Z2VuZXJhdGlvbisrO1xuXHRcdFx0c3BlY2llcyA9IDA7XG5cdFx0fVxuXHR9XG5cblx0ZnJhbWUrKztcblx0aWYgKGZyYW1lID4gMzAwKVxuXHRcdGxhc3Rfc3Bhd24rKztcblxufVxuXG4vL2VuZCBvZiBkcmF3KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuXG5mdW5jdGlvbiByZXNldF9kZWZlbmRlcnMoKTogdm9pZCB7XG5cdGZvciAobGV0IGkgPSB0ZWFtLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuXHRcdHRlYW0uc3BsaWNlKGksIDEpO1xuXG5cdGNyZWF0ZURlZmVuZGVycygpO1xuXG5cdGZvciAobGV0IGkgPSBtYWZpYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcblx0XHRtYWZpYS5zcGxpY2UoaSwgMSk7XG59XG5cbmZ1bmN0aW9uIGdyYXBoaWNzKCk6IHZvaWQge1xuXHRmdW5jdGlvbiByZW5kZXJTY29yZShzY29yZSA9IDApIHtcblx0XHRjb25zdCBtYXhTY29yZSA9IDM7XG5cdFx0cmV0dXJuIChzY29yZSA+IG1heFNjb3JlKVxuXHRcdFx0PyBg8J+Sjngke3Njb3JlfWBcblx0XHRcdDogKFsuLi5BcnJheShzY29yZSkuZmlsbCgn8J+SjicpXS5qb2luKCcnKSB8fCAwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlbmRlckxpdmVzKGN1cnJlbnQgPSAwLCBtYXggPSBudW1fbGl2ZXMpIHtcblx0XHRyZXR1cm4gWy4uLkFycmF5KGxpdmVzKS5maWxsKCfwn5KXJyksIC4uLkFycmF5KG1heCAtIGxpdmVzKS5maWxsKCfwn5akJyldLmpvaW4oJycpO1xuXHR9XG5cblx0Ly9TdGF0aWMgR3JhcGhpY3Ncblx0bGluZSgzMDAsIDAsIDMwMCwganNQYWdlSGVpZ2h0KTtcblx0bGluZSg4MDAsIDAsIDgwMCwganNQYWdlSGVpZ2h0KTtcblx0ZmlsbCgnIzE3M2U0MycpO1xuXHR0ZXh0U2l6ZSgyMCk7XG5cdHRleHQoJ0dlbmVyYXRpb24gJyArIGdlbmVyYXRpb24sIDgxMCwgMzApO1xuXHR0ZXh0KCdTcGVjaWVzOiAnICsgKHNwZWNpZXMgKyAxKSArICcvJyArIHNwZWNpZXNUb3RhbCwgODEwLCA1NSk7XG5cdHRleHQoJ1RvcCBTY29yZTogJyArIHRvcF9zY29yZSwgODEwLCA4MCk7XG5cdHRleHRTaXplKDIyKTtcblx0dGV4dCgnR2VuZXJhdGlvbiBJbmZvJywgODEwLCAxMTUpO1xuXHR0ZXh0KCdTcGVjaWVzIEluZm8nLCA4MTAsIDIxMCk7XG5cdHRleHQoJ0xlYWRlcmJvYXJkcycsIDgxMCwgMjg1KTtcblx0dGV4dFNpemUoMTgpO1xuXHR0ZXh0KGBBdmVyYWdlOiAgICAgICAkeyBhcnJheVN1bShzY29yZXMpIC8gc3BlY2llcyB9YCwgODEwLCAxMzUpOyAvL2NoYW5nZSB0byAxXG5cdHRleHQoYExhc3QgQXZlcmFnZTogICR7IGxhc3RfZ2VuX2F2Z31gLCA4MTAsIDE1NSk7XG5cdHRleHQoYEJlc3QgQXZlcmFnZTogICR7dG9wX2dlbl9hdmd9YCwgODEwLCAxNzUpO1xuXHR0ZXh0KGBDdXJyZW50IFNjb3JlOiAke3JlbmRlclNjb3JlKHNjb3JlKX1gLCA4MTAsIDIzMCk7XG5cdHRleHQoYOKdpExpdmVzOiAgICAgICAke3JlbmRlckxpdmVzKGxpdmVzLCBudW1fbGl2ZXMpfWAsIDgxMCwgMjUwKTtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRmaWxsKCcjMTczZTQzJywgMjU1IC0gKChnZW5lcmF0aW9uIC0gbGVhZGVyYm9hcmRbMV1baV0pICogNykpO1xuXHRcdGlmIChsZWFkZXJib2FyZFsxXVtpXSA9PSBnZW5lcmF0aW9uKSB7XG5cdFx0XHRpZiAobGVhZGVyYm9hcmRbMl1baV0gPT0gc3BlY2llcylcblx0XHRcdFx0ZmlsbCgnI0Q1QTAyMScpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRmaWxsKCcjM2ZiMGFjJyk7XG5cdFx0fVxuXHRcdHRleHQoKGkgKyAxKSArICcuIEdlbmVyYXRpb24gJyArIGxlYWRlcmJvYXJkWzFdW2ldICsgJzogJyArIGxlYWRlcmJvYXJkWzBdW2ldLCA4MTAsIDMxMCArIGkgKiAyMSk7XG5cdH1cblx0dGV4dFNpemUoMTIpO1xuXG5cdGxpbmVDaGFydC5kcmF3KDgxMCwgNTM1LCAyNzAsIDE3NSk7XG5cdG1lZGlhbkNoYXJ0LmRyYXcoODEwLCA1MzUsIDI3MCwgMTc1KTtcbn1cblxuZnVuY3Rpb24gbWFmaWFfc3Bhd24oKTogdm9pZCB7XG5cdC8vbWFmaWEgc3Bhd25cblx0aWYgKHJhbmRvbSgwLCAxKSA8IChsYXN0X3NwYXduICogMC4wMDAxKSkge1xuXHRcdGxldCByYWRpdXMgPSAoTWF0aC5leHAoLWZyYW1lIC8gMjAwMDApICogNDApO1xuXHRcdGxldCB2ZWwgPSAyO1xuXHRcdGlmIChmcmFtZSA+IDEwMDAwKVxuXHRcdFx0dmVsICs9IGZyYW1lIC8gMTAwMDA7XG5cdFx0Ly9jb25zb2xlLmxvZyhgU3Bhd246IFJhZGl1czogJHtyYWRpdXN9IFZlbDoke3ZlbH0gICAoRnJhbWU6JHtmcmFtZX0pYCk7XG5cblxuXHRcdHZlbCA9IDEwOy8vdG9kbzogcmVtb3ZlIChkZWJ1ZyBvbmx5KVxuXG5cdFx0bGV0IHBvc1ggPSAtcmFkaXVzO1xuXHRcdGxldCBwb3NZID0gcmFuZG9tKHJhZGl1cywganNQYWdlSGVpZ2h0IC0gcmFkaXVzKTtcblxuXHRcdG1hZmlhLnB1c2gobmV3IEVuZW15KHBvc1gsIHBvc1ksIHJhZGl1cywgdmVsKSk7XG5cdFx0bGFzdF9zcGF3biA9IDA7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlX21hZmlhKCk6IHZvaWQge1xuXG5cdGZvciAobGV0IGkgPSBtYWZpYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdG1hZmlhW2ldLnVwZGF0ZVBvcygpO1xuXHRcdGlmIChtYWZpYVtpXS5pbnRlcnNlY3QodGVhbSkpIHtcblx0XHRcdG1hZmlhLnNwbGljZShpLCAxKTsgLy9kZWxldGVcblx0XHRcdHNjb3JlKys7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRsZXQgcG9zID0gbWFmaWFbaV0ucG9zWDtcblx0XHRpZiAocG9zID49IDgwMCAtIG1hZmlhW2ldLnJhZGl1cykge1xuXHRcdFx0bWFmaWEuc3BsaWNlKGksIDEpOyAvL2RlbGV0ZVxuXHRcdFx0bGl2ZXMtLTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdG1hZmlhW2ldLmRyYXcoKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVfZGVmZW5kZXJzKCk6IHZvaWQge1xuXHQvL3VwZGF0ZSBkZWZlbmRlcnNcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0ZWFtLmxlbmd0aDsgaSsrKSB7XG5cdFx0dGVhbVtpXS5kcmF3KCk7XG5cdFx0Ly9jYWxjdWxlIGlucHV0c1xuXHRcdGxldCBkaXN0OiBudW1iZXJbXSA9IGNyZWF0ZUFycmF5KHRlYW0ubGVuZ3RoKTtcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHRlYW0ubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmIChqICE9IGkpIHtcblx0XHRcdFx0ZGlzdFtqXSA9IFZlY3Rvci5kaXN0YW5jZSh7eDogdGVhbVtpXS5wb3NYLCB5OiB0ZWFtW2ldLnBvc1l9LCB7eDogdGVhbVtqXS5wb3NYLCB5OiB0ZWFtW2pdLnBvc1l9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdFx0ZGlzdFtqXSA9IDk5OTk5O1xuXHRcdH1cblx0XHRsZXQgY2xvc2VzdCA9IE1hdGgubWluKC4uLmRpc3QpO1xuXHRcdC8vY29uc29sZS5sb2coXCIxc3Q6IFwiICsgY2xvc2VzdCk7XG5cdFx0bGV0IGluZGV4MTogbnVtYmVyID0gMDtcblx0XHRsZXQgaW5kZXgyOiBudW1iZXIgPSAwO1xuXHRcdHdoaWxlIChjbG9zZXN0ICE9IGRpc3RbaW5kZXgxXSlcblx0XHRcdGluZGV4MSsrO1xuXHRcdGRpc3RbaW5kZXgxXSA9IDk5OTk5O1xuXHRcdGNsb3Nlc3QgPSBNYXRoLm1pbiguLi5kaXN0KTtcblx0XHQvL2NvbnNvbGUubG9nKFwiMm5kOiBcIiArIGNsb3Nlc3QpO1xuXHRcdHdoaWxlIChjbG9zZXN0ICE9IGRpc3RbaW5kZXgyXSlcblx0XHRcdGluZGV4MisrO1xuXG5cdFx0bGV0IGlucHV0OiBudW1iZXJbXSA9IGNyZWF0ZUFycmF5KDEzKTtcblx0XHRpbnB1dFswXSA9ICh0ZWFtW2ldLnBvc1ggLSA2MDApIC8gMjAwLjAwOyAvL3BvcyB4XG5cdFx0aW5wdXRbMV0gPSAodGVhbVtpXS5wb3NZKSAvIChqc1BhZ2VIZWlnaHQgLyAyLjAwKTsvL3BvcyB5XG5cdFx0aW5wdXRbMl0gPSB0ZWFtW2ldLnZlbFggLyAyLjAwOy8vdmVsIHhcblx0XHRpbnB1dFszXSA9ICh0ZWFtW2ldLnZlbFkgLyAyLjAwKTsvL3ZlbCB5XG5cdFx0aW5wdXRbNF0gPSAoKHRlYW1baW5kZXgxXS5wb3NYIC0gNjAwKSAvIDIwMC4wMCkgLSBpbnB1dFswXTtcblx0XHRpbnB1dFs1XSA9ICgodGVhbVtpbmRleDFdLnBvc1kgLyAoanNQYWdlSGVpZ2h0IC8gMi4wMCkpKSAtIGlucHV0WzFdO1xuXHRcdGlucHV0WzZdID0gKHRlYW1baW5kZXgxXS52ZWxYIC8gMi4wMCkgLSBpbnB1dFsyXTtcblx0XHRpbnB1dFs3XSA9ICh0ZWFtW2luZGV4MV0udmVsWSAvIDIuMDApIC0gaW5wdXRbM107XG5cdFx0aW5wdXRbOF0gPSAoKHRlYW1baW5kZXgyXS5wb3NYIC0gNjAwKSAvIDIwMC4wMCkgLSBpbnB1dFswXTtcblx0XHRpbnB1dFs5XSA9ICgodGVhbVtpbmRleDJdLnBvc1kgLyAoanNQYWdlSGVpZ2h0IC8gMi4wMCkpKSAtIGlucHV0WzFdO1xuXHRcdGlucHV0WzEwXSA9ICh0ZWFtW2luZGV4Ml0udmVsWCAvIDIuMDApIC0gaW5wdXRbMl07XG5cdFx0aW5wdXRbMTFdID0gKHRlYW1baW5kZXgyXS52ZWxZIC8gMi4wMCkgLSBpbnB1dFszXTtcblx0XHRpbnB1dFsxMl0gPSAxOyAvL2JpYXNcblxuXHRcdC8vY29uc29sZS5sb2coYGlucHV0OiBYOiR7aW5wdXRbMF19IFk6JHtpbnB1dFsxXX0gVmVsWDoke2lucHV0WzJdfSBWZWxZOiR7aW5wdXRbM119YCk7XG5cblx0XHRsZXQgb3V0cHV0OiBudW1iZXJbXSA9IHNwZWNpZXNBRE5bc3BlY2llc10uY2FsY3VsYXRlT3V0cHV0KGlucHV0KTtcblx0XHR0ZWFtW2ldLmNoYW5nZV9hY2Mob3V0cHV0WzBdICogbWF4X2FjY192YXJpYXRpb24sIG91dHB1dFsxXSAqIG1heF9hY2NfdmFyaWF0aW9uKTtcblx0XHQvL2NvbnNvbGUubG9nKGBYOiAke3RlYW1bMF0ucG9zWH0gWTogJHt0ZWFtWzBdLnBvc1l9YCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gbmV3U3BlY2llcyhhbmNlc3RvcjogU3BlY2llc1tdLCBzY29yZXM6IG51bWJlcltdKTogU3BlY2llcyB7XG5cdGxldCBiYWJ5ID0gbmV3IFNwZWNpZXMoZmFsc2UpO1xuXHRsZXQgdG90YWxfc2NvcmUgPSAwO1xuXHRsZXQgZmxvYXRfc2NvcmVzOiBudW1iZXJbXSA9IGNyZWF0ZUFycmF5KHNwZWNpZXNUb3RhbCk7XG5cdC8vbm9ybWFsaXplXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc3BlY2llc1RvdGFsOyBpKyspIHtcblx0XHR0b3RhbF9zY29yZSArPSBzY29yZXNbaV0gKiogMjtcblx0fVxuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc3BlY2llc1RvdGFsOyBpKyspIHtcblx0XHRmbG9hdF9zY29yZXNbaV0gPSAoc2NvcmVzW2ldICoqIDIpIC8gdG90YWxfc2NvcmU7XG5cdH1cblxuXHQvL2NhbGN1bGF0ZSBnZW5lc1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IDEzOyBpKyspXG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG5cdFx0XHRsZXQgciA9IHJhbmRvbSgwLCAxKTtcblx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHR3aGlsZSAociA+PSAwKSB7XG5cdFx0XHRcdHIgPSByIC0gZmxvYXRfc2NvcmVzW2luZGV4XTtcblx0XHRcdFx0aW5kZXgrKztcblx0XHRcdH1cblx0XHRcdGluZGV4LS07XG5cdFx0XHRsZXQgbGF5ZXI6IG51bWJlcltdW10gPSBhbmNlc3RvcltpbmRleF0uZmlyc3RfbGF5ZXI7XG5cdFx0XHRiYWJ5LnNldF9sYXllcigxLCBpLCBqLCBsYXllcltpXVtqXSk7XG5cdFx0fVxuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMTE7IGkrKylcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IDI7IGorKykge1xuXHRcdFx0bGV0IHIgPSByYW5kb20oMCwgMSk7XG5cdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0d2hpbGUgKHIgPj0gMCkge1xuXHRcdFx0XHRyID0gciAtIGZsb2F0X3Njb3Jlc1tpbmRleF07XG5cdFx0XHRcdGluZGV4Kys7XG5cdFx0XHR9XG5cdFx0XHRpbmRleC0tO1xuXHRcdFx0bGV0IGxheWVyOiBudW1iZXJbXVtdID0gYW5jZXN0b3JbaW5kZXhdLnNlY29uZF9sYXllcjtcblx0XHRcdGJhYnkuc2V0X2xheWVyKDIsIGksIGosIGxheWVyW2ldW2pdKTtcblx0XHR9XG5cblx0Ly9jYWxjdWxhdGUgbXV0YXRpb25zXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMTM7IGkrKylcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcblx0XHRcdGxldCByID0gcmFuZG9tKDAsIDEpO1xuXHRcdFx0aWYgKHIgPCBtdXRhdGlvbl9yYXRlKVxuXHRcdFx0XHRiYWJ5LnNldF9sYXllcigxLCBpLCBqLCByYW5kb20oLTEsIDEpKTtcblx0XHR9XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxMTsgaSsrKVxuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgMjsgaisrKSB7XG5cdFx0XHRsZXQgciA9IHJhbmRvbSgwLCAxKTtcblx0XHRcdGlmIChyIDwgbXV0YXRpb25fcmF0ZSlcblx0XHRcdFx0YmFieS5zZXRfbGF5ZXIoMiwgaSwgaiwgcmFuZG9tKC0xLCAxKSk7XG5cdFx0fVxuXG5cdHJldHVybiBiYWJ5O1xufVxuXG5cbmZ1bmN0aW9uIHNvcnRMZWFkZXJib2FyZChvbGQ6IG51bWJlcltdW10pOiBudW1iZXJbXVtdIHtcblx0bGV0IHNvcnRlZDogbnVtYmVyW11bXSA9IGNyZWF0ZU1hdHJpeCgzLCAxMCk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0bGV0IG1heCA9IE1hdGgubWF4KC4uLm9sZFswXSk7XG5cdFx0bGV0IGluZGV4ID0gMDtcblx0XHR3aGlsZSAob2xkWzBdW2luZGV4XSAhPSBtYXgpXG5cdFx0XHRpbmRleCsrO1xuXHRcdHNvcnRlZFswXVtpXSA9IG9sZFswXVtpbmRleF07XG5cdFx0c29ydGVkWzFdW2ldID0gb2xkWzFdW2luZGV4XTtcblx0XHRzb3J0ZWRbMl1baV0gPSBvbGRbMl1baW5kZXhdO1xuXHRcdG9sZFswXVtpbmRleF0gPSAtMTtcblx0fVxuXHRyZXR1cm4gc29ydGVkO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FpX2Nvb3AudHMiLCJpbXBvcnQge2pzUGFnZUhlaWdodCwgbGltaXR9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQge0NpcmNsZX0gZnJvbSAnLi9jaXJjbGUnO1xuXG5jb25zdCByYWRpdXMgPSAzNTtcbmNvbnN0IGJveEJvdW5kcyA9IHtzdGFydDogMzAwLCBlbmQ6IDgwMH07XG5jb25zdCBjb2xvciA9ICcjM2ZiMGFjJztcblxuZXhwb3J0IGNsYXNzIERlZmVuZGVyIGV4dGVuZHMgQ2lyY2xlIHtcblxuXHRtYXhfYWNjID0gMC4xO1xuXHRtYXhfdmVsID0gMjtcblxuXHRhY2NYID0gMDtcblx0YWNjWSA9IDA7XG5cdHZlbFggPSAwO1xuXHR2ZWxZID0gMDtcblxuXHRjb25zdHJ1Y3Rvcihwb3NYOiBudW1iZXIsIHBvc1k6IG51bWJlcikge1xuXHRcdHN1cGVyKHBvc1gsIHBvc1ksIHJhZGl1cywgY29sb3IpO1xuXHR9XG5cblx0Y2hhbmdlX2FjYyhjaGFuZ2VYOiBudW1iZXIsIGNoYW5nZVk6IG51bWJlcik6IHZvaWQge1xuXHRcdHRoaXMuYWNjWCArPSBjaGFuZ2VYO1xuXHRcdHRoaXMuYWNjWSArPSBjaGFuZ2VZO1xuXHRcdHRoaXMuYWNjWCA9IGxpbWl0KHRoaXMuYWNjWCwgdGhpcy5tYXhfYWNjLCAtdGhpcy5tYXhfYWNjKTtcblx0XHR0aGlzLmFjY1kgPSBsaW1pdCh0aGlzLmFjY1ksIHRoaXMubWF4X2FjYywgLXRoaXMubWF4X2FjYyk7XG5cblx0XHR0aGlzLnZlbFggKz0gdGhpcy5hY2NYO1xuXHRcdHRoaXMudmVsWSArPSB0aGlzLmFjY1k7XG5cdFx0dGhpcy52ZWxYID0gbGltaXQodGhpcy52ZWxYLCB0aGlzLm1heF92ZWwsIC10aGlzLm1heF92ZWwpO1xuXHRcdHRoaXMudmVsWSA9IGxpbWl0KHRoaXMudmVsWSwgdGhpcy5tYXhfdmVsLCAtdGhpcy5tYXhfdmVsKTtcblxuXG5cdFx0c3VwZXIudXBkYXRlUG9zKCk7XG5cblx0XHR0aGlzLnBvc1ggPSBsaW1pdCh0aGlzLnBvc1gsIGJveEJvdW5kcy5lbmQgLSB0aGlzLnJhZGl1cywgYm94Qm91bmRzLnN0YXJ0ICsgdGhpcy5yYWRpdXMpO1xuXHRcdHRoaXMucG9zWSA9IGxpbWl0KHRoaXMucG9zWSwganNQYWdlSGVpZ2h0IC0gdGhpcy5yYWRpdXMsIHRoaXMucmFkaXVzKTtcblx0fVxufVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZGVmZW5kZXIudHMiLCJpbXBvcnQge0RlZmVuZGVyfSBmcm9tICcuL2RlZmVuZGVyJztcbmltcG9ydCB7Q2lyY2xlfSBmcm9tICcuL2NpcmNsZSc7XG5pbXBvcnQge1ZlY3Rvcn0gZnJvbSAnLi92ZWN0b3InO1xuXG5cbmNvbnN0IGNvbG9yID0gJyNmYWU1OTYnO1xuXG5cbmV4cG9ydCBjbGFzcyBFbmVteSBleHRlbmRzIENpcmNsZSB7XG5cblx0dmVsWDogbnVtYmVyO1xuXG5cdGNvbnN0cnVjdG9yKHBvc1gsIHBvc1ksIHJhZGl1czogbnVtYmVyLCB2ZWxYOiBudW1iZXIpIHtcblx0XHRzdXBlcihwb3NYLCBwb3NZLCByYWRpdXMsIGNvbG9yKTtcblxuXHRcdHRoaXMudmVsWCA9IHZlbFg7XG5cblx0fVxuXG5cdGludGVyc2VjdCh0ZWFtOiBBcnJheTxEZWZlbmRlcj4pOiBib29sZWFuIHtcblx0XHQvL3RvZG86IHVzZSBhbnlcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRlYW0ubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBkaXN0ID0gVmVjdG9yLmRpc3RhbmNlKHt4OiB0aGlzLnBvc1gsIHk6IHRoaXMucG9zWX0sIHt4OiB0ZWFtW2ldLnBvc1gsIHk6IHRlYW1baV0ucG9zWX0pO1xuXHRcdFx0aWYgKGRpc3QgPCAodGhpcy5yYWRpdXMgKyB0ZWFtW2ldLnJhZGl1cykpXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lbmVteS50cyIsImltcG9ydCB7Y3JlYXRlTWF0cml4LCByYW5kb219IGZyb20gJy4vaGVscGVycyc7XHJcblxyXG5jb25zdCBoaWRkZW5OZXVyb25zQ291bnQgPSAxMTtcclxuY29uc3Qgb3V0cHV0Q291bnQgPSAyO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNwZWNpZXMge1xyXG5cclxuICAgIC8vdG9kbzogcmVmYWMgbWFrZSBzaXphYmxlP1xyXG4gICAgZmlyc3RfbGF5ZXI6IG51bWJlcltdW107XHJcbiAgICBzZWNvbmRfbGF5ZXI6IG51bWJlcltdW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoaXNSYW5kb206IGJvb2xlYW4pIHtcclxuXHJcbiAgICAgICAgLy90b2RvOiBsYXllciBzaXplcyB0byB2YXJzXHJcbiAgICAgICAgdGhpcy5maXJzdF9sYXllciA9IGNyZWF0ZU1hdHJpeCgxMywgMTApO1xyXG4gICAgICAgIHRoaXMuc2Vjb25kX2xheWVyID0gY3JlYXRlTWF0cml4KGhpZGRlbk5ldXJvbnNDb3VudCwgb3V0cHV0Q291bnQpO1xyXG5cclxuICAgICAgICBpZiAoaXNSYW5kb20pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgLyppbnQqLyBpID0gMDsgaSA8IDEzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfbGF5ZXJbaV0gPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IC8qaW50Ki8gaiA9IDA7IGogPCAxMDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdF9sYXllcltpXVtqXSA9IHJhbmRvbSgtMSwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IC8qaW50Ki8gaSA9IDA7IGkgPCBoaWRkZW5OZXVyb25zQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRfbGF5ZXJbaV0gPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IC8qaW50Ki8gaiA9IDA7IGogPCBvdXRwdXRDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRfbGF5ZXJbaV1bal0gPSByYW5kb20oLTEsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNhbGN1bGF0ZU91dHB1dChpbnB1dDogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IGhpZGRlbiA9IG5ldyBBcnJheShoaWRkZW5OZXVyb25zQ291bnQpLmZpbGwoMCk7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IG5ldyBBcnJheShvdXRwdXRDb3VudCkuZmlsbCgwKTtcclxuXHJcbiAgICAgICAgaGlkZGVuW2hpZGRlbk5ldXJvbnNDb3VudCAtIDFdID0gMTsgLy9iaWFzXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRpb25Gbih2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuICgyIC8gKDEgKyBNYXRoLmV4cCgtMiAqIHZhbHVlKSkpIC0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdG9kbzogcmVmYWNcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaGlkZGVuW2ldICs9IGlucHV0W2pdICogdGhpcy5maXJzdF9sYXllcltqXVtpXTtcclxuICAgICAgICAgICAgICAgIC8vYWN0aXZhdGlvbiBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgaGlkZGVuW2ldID0gYWN0aXZhdGlvbkZuKGhpZGRlbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTE7IGorKykge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0W2ldICs9IGhpZGRlbltqXSAqIHRoaXMuc2Vjb25kX2xheWVyW2pdW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9hY3RpdmF0aW9uIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbaV0gPSBhY3RpdmF0aW9uRm4ob3V0cHV0W2ldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldF9sYXllcihsYXllcjogbnVtYmVyLCBpOiBudW1iZXIsIGo6IG51bWJlciwgdmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIC8vdG9kbzogcmVmYWNcclxuICAgICAgICBpZiAobGF5ZXIgPT09IDEpXHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RfbGF5ZXJbaV1bal0gPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGxheWVyID09PSAyKVxyXG4gICAgICAgICAgICB0aGlzLnNlY29uZF9sYXllcltpXVtqXSA9IHZhbHVlO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NwZWNpZXMudHMiLCJleHBvcnQgY2xhc3MgWFlDaGFydCB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJ0cyBub3QgaW1wbCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1pblkoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1heFkoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1pblgoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1heFgoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dYQXhpcyguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1lBeGlzKC4uLmFyZ3MpIHtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb2ludFNpemUoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldExpbmVXaWR0aCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0WEF4aXNMYWJlbCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0WUZvcm1hdCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0WEZvcm1hdCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TGluZUNvbG91ciguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UG9pbnRDb2xvdXIoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoLi4uYXJncykge1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3h5Q2hhcnQudHMiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMC0xIS4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTAtMiEuL3N0eWxlcy5sZXNzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTAtMSEuLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS0wLTIhLi9zdHlsZXMubGVzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMC0xIS4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTAtMiEuL3N0eWxlcy5sZXNzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMubGVzc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW87XG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9O1xuXHR9LFxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gL21zaWUgWzYtOV1cXGIvLnRlc3Qoc2VsZi5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xuXHR9KSxcblx0Z2V0SGVhZEVsZW1lbnQgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XG5cdH0pLFxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgPGhlYWQ+LlxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2Vcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XG5cdHZhciBoZWFkID0gZ2V0SGVhZEVsZW1lbnQoKTtcblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cdHN0eWxlRWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblx0bGlua0VsZW1lbnQucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XG5cdHJldHVybiBsaW5rRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlO1xuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcblx0fSBlbHNlIGlmKG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHRcdGlmKHN0eWxlRWxlbWVudC5ocmVmKVxuXHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlRWxlbWVudC5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XG5cdFx0aWYobmV3T2JqKSB7XG5cdFx0XHRpZihuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGVFbGVtZW50LCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZUVsZW1lbnQuY2hpbGROb2Rlcztcblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlRWxlbWVudCwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rKGxpbmtFbGVtZW50LCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdGlmKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XG5cblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKVxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=