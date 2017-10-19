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
/******/ 	var hotCurrentHash = "fb361983490ba9f0e050"; // eslint-disable-line no-unused-vars
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
/******/ 	return hotCreateRequire(3)(__webpack_require__.s = 3);
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
const jsPageHeight = 750;
/* harmony export (immutable) */ __webpack_exports__["e"] = jsPageHeight;
 //todo: remove!
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
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(9)(true);
// imports


// module
exports.push([module.i, "html,\nbody {\n  height: 100vh;\n  padding: 0;\n  margin: 0;\n}\n", "", {"version":3,"sources":["B:/Projects/nn-coop-balls/src/B:/Projects/nn-coop-balls/src/styles.less","B:/Projects/nn-coop-balls/src/styles.less"],"names":[],"mappings":"AAAA;;EACI,cAAA;EACA,WAAA;EACA,UAAA;CCEH","file":"styles.less","sourcesContent":["html,body{\n    height: 100vh;\n    padding: 0;\n    margin:0;\n}\n\nbody{\n\n}\n\n\ncanvas{\n\n}","html,\nbody {\n  height: 100vh;\n  padding: 0;\n  margin: 0;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Point {
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Point;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__defender__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__enemy__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__species__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__xyChart__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styles_less__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styles_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__styles_less__);
//import org.gicentre.utils.stat.*; //todo: charts here






//Global
let mutation_rate = 0.005;
let num_species = 25;
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
const gbSize = { width: 1080, height: 720 };
const gb = document.querySelector('#gameboard');
const ctx = gb.getContext('2d');
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
    gb.width = gbSize.width;
    gb.height = gbSize.height;
    setupCharts();
    //console.log("Generation\t|\tAverage\t|\tMedian\t|\tTop All Time");
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
setup();
draw();
const SEC = 1000;
let FPS = 60;
//todo: gameloop?
setInterval(() => draw(), SEC / FPS);
function draw() {
    //if (graphicsFlag)
    background('#dddfd4');
    //if (graphicsFlag)
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
        //console.log(scores[species]);
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
    if (Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(0, 1) < (last_spawn * 0.0001)) {
        let radius = (Math.exp(-frame / 20000) * 40);
        let vel = 2;
        if (frame > 10000)
            vel += frame / 10000;
        //console.log(`Spawn: Radius: ${radius} Vel:${vel}   (Frame:${frame})`);
        mafia.push(new __WEBPACK_IMPORTED_MODULE_2__enemy__["a" /* Enemy */](radius, vel));
        last_spawn = 0;
    }
}
function update_mafia() {
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
            else
                ellipse(mafia[i].getX(), mafia[i].getY(), mafia[i].getRadius(), '#fae596');
        }
    }
}
function update_defenders() {
    //update defenders
    for (let i = 0; i < team.length; i++) {
        /*if (graphicsFlag)*/ {
            ellipse(team[i].getX(), team[i].getY(), team[i].getRadius(), '#3fb0ac');
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
        //console.log(`input: X:${input[0]} Y:${input[1]} VelX:${input[2]} VelY:${input[3]}`);
        let output = speciesADN[species].calculateOutput(input);
        team[i].change_acc(output[0] * max_acc_variation, output[1] * max_acc_variation);
        //console.log(`X: ${team[0].getX()} Y: ${team[0].getY()}`);
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Point__ = __webpack_require__(2);


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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Point__ = __webpack_require__(2);


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
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(10)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(1, function() {
			var newContent = __webpack_require__(1);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
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
/* 10 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZmIzNjE5ODM0OTBiYTlmMGUwNTAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hlbHBlcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy5sZXNzIiwid2VicGFjazovLy8uL3NyYy9Qb2ludC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWlfY29vcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGVmZW5kZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VuZW15LnRzIiwid2VicGFjazovLy8uL3NyYy9zcGVjaWVzLnRzIiwid2VicGFjazovLy8uL3NyYy94eUNoYXJ0LnRzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMubGVzcz83ZDVlIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0EsV0FBRzs7QUFFSCxvREFBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdC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QU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLDhEQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU07UUFFckIsc0ZBQXNGO1FBRXRGLElBQUksTUFBTSxHQUFhLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcs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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQSw2QkFBNkIsbUJBQW1COztBQUVoRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9kaXN0L2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gXHJcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHRcdGlmKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdH0gO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHQ7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXF1ZXN0VGltZW91dCA9IHJlcXVlc3RUaW1lb3V0IHx8IDEwMDAwO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IHJlcXVlc3RUaW1lb3V0O1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCJmYjM2MTk4MzQ5MGJhOWYwZTA1MFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xyXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXHJcbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XHJcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XHJcbiBcdFx0XHR9KS50aGVuKFxyXG4gXHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHQpO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgY2I7XHJcbiBcdFx0dmFyIGk7XHJcbiBcdFx0dmFyIGo7XHJcbiBcdFx0dmFyIG1vZHVsZTtcclxuIFx0XHR2YXIgbW9kdWxlSWQ7XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XHJcbiBcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXHJcbiBcdFx0XHRcdFx0aWQ6IGlkXHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XHJcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX21haW4pIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZighcGFyZW50KSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxyXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcclxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xyXG4gXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiKTtcclxuIFx0XHR9O1xyXG4gXHRcclxuIFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQ7XHJcbiBcdFx0XHRcdGlmKGhvdFVwZGF0ZVtpZF0pIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XHJcbiBcdFx0XHRcdGlmKHJlc3VsdC5jaGFpbikge1xyXG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRzd2l0Y2gocmVzdWx0LnR5cGUpIHtcclxuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vblVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25BY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRpc3Bvc2VkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRkZWZhdWx0OlxyXG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihhYm9ydEVycm9yKSB7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvQXBwbHkpIHtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHRcdFx0XHRmb3IobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9EaXNwb3NlKSB7XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XHJcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcclxuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcclxuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcclxuIFx0XHR2YXIgaWR4O1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdGlmKCFtb2R1bGUpIGNvbnRpbnVlO1xyXG4gXHRcclxuIFx0XHRcdHZhciBkYXRhID0ge307XHJcbiBcdFxyXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXHJcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdFx0aWYoY2IpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyLCAvLyBUT0RPIHJlbW92ZSBpbiB3ZWJwYWNrIDRcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXHJcbiBcdFx0aWYoZXJyb3IpIHtcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xyXG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDMpKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGZiMzYxOTgzNDkwYmE5ZjBlMDUwIiwiLy90b2RvOiBnZXQgZnJvbSBwYWdlXHJcbmV4cG9ydCBjb25zdCBqc1BhZ2VIZWlnaHQgPSA3NTA7Ly90b2RvOiByZW1vdmUhXHJcblxyXG4vL3RvZG86IGltcGxcclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1hdGguc3FydCgoeDEgLSB4MikgKiogMiArICh5MSAtIHkyKSAqKiAyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbShtaW46IG51bWJlciA9IDAsIG1heDogbnVtYmVyID0gMSk6IG51bWJlciB7XHJcbiAgICAvL3JhbmdlIHJhbmRvbVxyXG4gICAgcmV0dXJuIG1pbiArIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxpbWl0KHZhbHVlOiBudW1iZXIsIG1heDogbnVtYmVyLCBtaW46IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBpZiAodmFsdWUgPCBtaW4pIHJldHVybiBtaW47XHJcbiAgICBpZiAodmFsdWUgPiBtYXgpIHJldHVybiBtYXg7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlTdW0oYXJyOiBudW1iZXJbXSk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gYXJyLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiBzdW0gKyBpdGVtLCAwKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcnJheShsZW5ndGg6IG51bWJlciwgdmFsdWUgPSAwKTogbnVtYmVyW10ge1xyXG4gICAgcmV0dXJuIEFycmF5KGxlbmd0aCkuZmlsbCh2YWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXRyaXgocm93czogbnVtYmVyLCBjb2xzOiBudW1iZXIsIHZhbHVlID0gMCk6IG51bWJlcltdW10ge1xyXG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5KHJvd3MpLm1hcCgoKSA9PiBjcmVhdGVBcnJheShjb2xzLCB2YWx1ZSkpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5mKHZhbHVlOiBudW1iZXIsIC4uLmFyZ3MpIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9oZWxwZXJzLnRzIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh0cnVlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImh0bWwsXFxuYm9keSB7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgcGFkZGluZzogMDtcXG4gIG1hcmdpbjogMDtcXG59XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkI6L1Byb2plY3RzL25uLWNvb3AtYmFsbHMvc3JjL0I6L1Byb2plY3RzL25uLWNvb3AtYmFsbHMvc3JjL3N0eWxlcy5sZXNzXCIsXCJCOi9Qcm9qZWN0cy9ubi1jb29wLWJhbGxzL3NyYy9zdHlsZXMubGVzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7RUFDSSxjQUFBO0VBQ0EsV0FBQTtFQUNBLFVBQUE7Q0NFSFwiLFwiZmlsZVwiOlwic3R5bGVzLmxlc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiaHRtbCxib2R5e1xcbiAgICBoZWlnaHQ6IDEwMHZoO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBtYXJnaW46MDtcXG59XFxuXFxuYm9keXtcXG5cXG59XFxuXFxuXFxuY2FudmFze1xcblxcbn1cIixcImh0bWwsXFxuYm9keSB7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgcGFkZGluZzogMDtcXG4gIG1hcmdpbjogMDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvbGliL2xvYWRlci5qcz97XCJzb3VyY2VNYXBcIjp0cnVlfSEuL3NyYy9zdHlsZXMubGVzc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgUG9pbnR7XHJcblx0cG9zWDogbnVtYmVyO1xyXG5cdHBvc1k6IG51bWJlcjtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Qb2ludC50cyIsIi8vaW1wb3J0IG9yZy5naWNlbnRyZS51dGlscy5zdGF0Lio7IC8vdG9kbzogY2hhcnRzIGhlcmVcclxuXHJcblxyXG5pbXBvcnQge2pzUGFnZUhlaWdodCwgcmFuZG9tLCBkaXN0YW5jZSwgbGltaXQsIGFycmF5U3VtLCBjcmVhdGVNYXRyaXgsIGNyZWF0ZUFycmF5LCBuZn0gZnJvbSAnLi9oZWxwZXJzJztcclxuXHJcbmltcG9ydCB7RGVmZW5kZXJ9IGZyb20gJy4vZGVmZW5kZXInO1xyXG5pbXBvcnQge0VuZW15fSBmcm9tICcuL2VuZW15JztcclxuaW1wb3J0IHtTcGVjaWVzfSBmcm9tICcuL3NwZWNpZXMnO1xyXG5pbXBvcnQge1hZQ2hhcnR9IGZyb20gJy4veHlDaGFydCc7XHJcblxyXG5pbXBvcnQgJy4vc3R5bGVzLmxlc3MnO1xyXG5cclxuXHJcbi8vR2xvYmFsXHJcbmxldCBtdXRhdGlvbl9yYXRlID0gMC4wMDU7XHJcbmxldCBudW1fc3BlY2llcyA9IDI1O1xyXG5sZXQgbWF4X2FjY192YXJpYXRpb24gPSAwLjAxO1xyXG5sZXQgbnVtX2RlZmVuZGVycyA9IDY7XHJcbmxldCBudW1fbGl2ZXMgPSAzO1xyXG5sZXQgc3RvcCA9IGZhbHNlO1xyXG5cclxubGV0IGdyYXBoaWNzRmxhZyA9IGZhbHNlO1xyXG5cclxubGV0IHRlYW06IERlZmVuZGVyW10gPSBbXTtcclxubGV0IG1hZmlhOiBFbmVteVtdID0gW107XHJcbmxldCBzcGVjaWVzQUROOiBTcGVjaWVzW10gPSBbXTtcclxubGV0IGdlbmVyYXRpb24gPSAxO1xyXG5sZXQgbGFzdF9zcGF3biA9IDE7XHJcbmxldCBmcmFtZSA9IDEuMDA7XHJcbmxldCBsaXZlcyA9IG51bV9saXZlcztcclxubGV0IHNwZWNpZXMgPSAwO1xyXG5sZXQgc2NvcmUgPSAwO1xyXG5sZXQgc2NvcmVzOiBudW1iZXJbXSA9IGNyZWF0ZUFycmF5KG51bV9zcGVjaWVzKTtcclxubGV0IHRvcF9zY29yZSA9IDA7XHJcbmxldCB0b3Bfc2NvcmVfZ2VuID0gMDtcclxubGV0IGxhc3RfZ2VuX2F2ZyA9IDA7XHJcbmxldCB0b3BfZ2VuX2F2ZyA9IDA7XHJcbmxldCBsZWFkZXJib2FyZDogbnVtYmVyW11bXSA9IGNyZWF0ZU1hdHJpeCgzLCAxMCk7XHJcbmxldCBsaW5lQ2hhcnQ6IFhZQ2hhcnQ7XHJcbmxldCBtZWRpYW5DaGFydDogWFlDaGFydDtcclxubGV0IGdlbmVyYXRpb25fYXJyYXk6IG51bWJlcltdID0gW107XHJcbmxldCBoaXN0b3J5X2F2ZzogbnVtYmVyW10gPSBbXTtcclxubGV0IGhpc3RvcnlfdG9wOiBudW1iZXJbXSA9IFtdO1xyXG5sZXQgaGlzdG9yeV9tZWQ6IG51bWJlcltdID0gW107XHJcbmxldCAvKlRhYmxlKi8gdGFibGU7XHJcblxyXG5sZXQgZXZvbHV0aW9uX2VuZCA9IGZhbHNlO1xyXG5cclxubGV0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcblxyXG5jb25zdCBnYlNpemUgPSB7d2lkdGg6IDEwODAsIGhlaWdodDogNzIwfTtcclxuY29uc3QgZ2I6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbWVib2FyZCcpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG5jb25zdCBjdHggPSBnYi5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGJhY2tncm91bmQoY29sb3I6IHN0cmluZykge1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIGdiU2l6ZS53aWR0aCwgZ2JTaXplLmhlaWdodCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpbmUoeDEsIHkxLCB4MiwgeTIpIHtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcclxuICAgIGN0eC5saW5lVG8oeDIsIHkyKTtcclxuICAgIGN0eC5zdHJva2UoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZWxsaXBzZSh4MSwgeTEsIHJhZGl1cywgY29sb3I/KSB7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHguYXJjKHgxLCB5MSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG5cclxuICAgIGlmIChjb2xvcikge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IDM7XHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0ZXh0KHZhbHVlLCB4LCB5LCBzaXplID0gMjApIHtcclxuICAgIC8vY3R4LmZvbnQgPSAnMjBweCBBcmlhbCc7XHJcbiAgICAvL2N0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgY3R4LmZpbGxUZXh0KHZhbHVlLCB4LCB5KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsbChjb2xvciwgYWxwaGEgPSAyNTUpIHtcclxuICAgIC8vdG9kbzogaW1wbCBhbHBoYVxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0ZXh0U2l6ZShzaXplKSB7XHJcbiAgICBjdHguZm9udCA9IGAke3NpemV9cHggQXJpYWxgO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gc2V0dXBDaGFydHMoKSB7XHJcbiAgICBsaW5lQ2hhcnQgPSBuZXcgWFlDaGFydCh0aGlzKTtcclxuICAgIC8vIEF4aXMgZm9ybWF0dGluZyBhbmQgbGFiZWxzLlxyXG4gICAgbGluZUNoYXJ0LnNob3dYQXhpcyh0cnVlKTtcclxuICAgIGxpbmVDaGFydC5zaG93WUF4aXModHJ1ZSk7XHJcbiAgICAvLyBTeW1ib2wgY29sb3Vyc1xyXG4gICAgbGluZUNoYXJ0LnNldFBvaW50U2l6ZSgyKTtcclxuICAgIGxpbmVDaGFydC5zZXRMaW5lV2lkdGgoMik7XHJcbiAgICBsaW5lQ2hhcnQuc2V0TWluWSgwKTtcclxuICAgIGxpbmVDaGFydC5zZXRYQXhpc0xhYmVsKFwiR2VuZXJhdGlvblwiKTtcclxuICAgIGxpbmVDaGFydC5zZXRZRm9ybWF0KFwiIyMjXCIpO1xyXG4gICAgbGluZUNoYXJ0LnNldFhGb3JtYXQoXCIjIyNcIik7XHJcblxyXG4gICAgbWVkaWFuQ2hhcnQgPSBuZXcgWFlDaGFydCh0aGlzKTtcclxuICAgIC8vIEF4aXMgZm9ybWF0dGluZyBhbmQgbGFiZWxzLlxyXG4gICAgbWVkaWFuQ2hhcnQuc2hvd1hBeGlzKHRydWUpO1xyXG4gICAgbWVkaWFuQ2hhcnQuc2hvd1lBeGlzKHRydWUpO1xyXG4gICAgLy8gU3ltYm9sIGNvbG91cnNcclxuICAgIG1lZGlhbkNoYXJ0LnNldFBvaW50U2l6ZSgyKTtcclxuICAgIG1lZGlhbkNoYXJ0LnNldExpbmVXaWR0aCgyKTtcclxuICAgIG1lZGlhbkNoYXJ0LnNldE1pblkoMCk7XHJcbiAgICBtZWRpYW5DaGFydC5zZXRZRm9ybWF0KFwiIyMjXCIpO1xyXG4gICAgbWVkaWFuQ2hhcnQuc2V0WEZvcm1hdChcIiMjI1wiKTtcclxuICAgIG1lZGlhbkNoYXJ0LnNldFhBeGlzTGFiZWwoXCJHZW5lcmF0aW9uXCIpO1xyXG4gICAgbWVkaWFuQ2hhcnQuc2V0TGluZUNvbG91cignI0Q1QTAyMScpO1xyXG4gICAgbWVkaWFuQ2hhcnQuc2V0UG9pbnRDb2xvdXIoJyNENUEwMjEnKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHNldHVwKCk6IHZvaWQge1xyXG4gICAgZ2Iud2lkdGggPSBnYlNpemUud2lkdGg7XHJcbiAgICBnYi5oZWlnaHQgPSBnYlNpemUuaGVpZ2h0O1xyXG5cclxuXHJcbiAgICBzZXR1cENoYXJ0cygpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coXCJHZW5lcmF0aW9uXFx0fFxcdEF2ZXJhZ2VcXHR8XFx0TWVkaWFuXFx0fFxcdFRvcCBBbGwgVGltZVwiKTtcclxuXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fZGVmZW5kZXJzOyBpKyspXHJcbiAgICAgICAgdGVhbS5wdXNoKG5ldyBEZWZlbmRlcihpICsgMSwgbnVtX2RlZmVuZGVycykpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX3NwZWNpZXM7IGkrKylcclxuICAgICAgICBzcGVjaWVzQUROLnB1c2gobmV3IFNwZWNpZXModHJ1ZSkpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG4gICAgICAgIGxlYWRlcmJvYXJkWzBdW2ldID0gMDtcclxuICAgICAgICBsZWFkZXJib2FyZFsxXVtpXSA9IDA7XHJcbiAgICAgICAgbGVhZGVyYm9hcmRbMl1baV0gPSAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuc2V0dXAoKTtcclxuZHJhdygpO1xyXG5jb25zdCBTRUMgPSAxMDAwO1xyXG5sZXQgRlBTID0gNjA7XHJcbi8vdG9kbzogZ2FtZWxvb3A/XHJcbnNldEludGVydmFsKCgpID0+IGRyYXcoKSwgU0VDIC8gRlBTKTtcclxuXHJcbmZ1bmN0aW9uIGRyYXcoKTogdm9pZCB7XHJcblxyXG4gICAgLy9pZiAoZ3JhcGhpY3NGbGFnKVxyXG4gICAgICAgIGJhY2tncm91bmQoJyNkZGRmZDQnKTtcclxuXHJcbiAgICAvL2lmIChncmFwaGljc0ZsYWcpXHJcbiAgICAgICAgZ3JhcGhpY3MoKTtcclxuXHJcbiAgICB1cGRhdGVfZGVmZW5kZXJzKCk7XHJcbiAgICB1cGRhdGVfbWFmaWEoKTtcclxuICAgIGlmICghZXZvbHV0aW9uX2VuZClcclxuICAgICAgICBtYWZpYV9zcGF3bigpO1xyXG5cclxuXHJcbiAgICBpZiAoc2NvcmUgPj0gbGVhZGVyYm9hcmRbMF1bOV0pIHtcclxuICAgICAgICBsZXQgbmV3X2VudHJ5ID0gdHJ1ZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGxlYWRlcmJvYXJkWzFdW2ldID09IGdlbmVyYXRpb24gJiYgbGVhZGVyYm9hcmRbMl1baV0gPT0gc3BlY2llcykge1xyXG4gICAgICAgICAgICAgICAgbmV3X2VudHJ5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBsZWFkZXJib2FyZFswXVtpXSA9IHNjb3JlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdfZW50cnkpIHtcclxuICAgICAgICAgICAgbGVhZGVyYm9hcmRbMF1bOV0gPSBzY29yZTtcclxuICAgICAgICAgICAgbGVhZGVyYm9hcmRbMV1bOV0gPSBnZW5lcmF0aW9uO1xyXG4gICAgICAgICAgICBsZWFkZXJib2FyZFsyXVs5XSA9IHNwZWNpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxlYWRlcmJvYXJkID0gc29ydExlYWRlcmJvYXJkKGxlYWRlcmJvYXJkKTtcclxuICAgIH1cclxuXHJcbiAgICAvL2VuZCBvZiBzcGVjaWVzXHJcbiAgICBpZiAobGl2ZXMgPT0gMCkge1xyXG4gICAgICAgIGxpdmVzID0gbnVtX2xpdmVzO1xyXG4gICAgICAgIHNjb3Jlc1tzcGVjaWVzXSA9IHNjb3JlO1xyXG4gICAgICAgIHRvcF9zY29yZSA9IE1hdGgubWF4KHRvcF9zY29yZSwgc2NvcmUpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coc2NvcmVzW3NwZWNpZXNdKTtcclxuICAgICAgICBzcGVjaWVzKys7XHJcbiAgICAgICAgc2NvcmUgPSAwO1xyXG4gICAgICAgIGZyYW1lID0gMDtcclxuICAgICAgICBsYXN0X3NwYXduID0gMDtcclxuICAgICAgICByZXNldF9kZWZlbmRlcnMoKTtcclxuICAgICAgICBpZiAoc3BlY2llcyA9PSBudW1fc3BlY2llcykgLy9lbmQgb2YgZ2VuZXJhdGlvblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy9zY29yZSBvcmRlclxyXG4gICAgICAgICAgICBsZXQgb3JkZXJlZF9zY29yZXM6IG51bWJlcltdID0gY3JlYXRlQXJyYXkobnVtX3NwZWNpZXMpO1xyXG4gICAgICAgICAgICBsZXQgb3JkZXJlZF9zcGVjaWVzQUROOiBTcGVjaWVzW10gPSBbXTtcclxuICAgICAgICAgICAgLypuZXcgQXJyYXkgPCBTcGVjaWVzID4gKCkqL1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fc3BlY2llczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdG9wX3Njb3JlID0gTWF0aC5tYXgoLi4uc2NvcmVzKTtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoc2NvcmVzW2luZGV4XSAhPSB0b3Bfc2NvcmUpXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIG9yZGVyZWRfc2NvcmVzW2ldID0gc2NvcmVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIHNjb3Jlc1tpbmRleF0gPSAtMTtcclxuICAgICAgICAgICAgICAgIG9yZGVyZWRfc3BlY2llc0FETi5wdXNoKHNwZWNpZXNBRE5baW5kZXhdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzY29yZXMgPSBvcmRlcmVkX3Njb3JlcztcclxuICAgICAgICAgICAgdG9wX3Njb3JlX2dlbiA9IHNjb3Jlc1swXTtcclxuICAgICAgICAgICAgc3BlY2llc0FETiA9IG9yZGVyZWRfc3BlY2llc0FETjtcclxuICAgICAgICAgICAgLy9uZXcgc3BlY2llc1xyXG4gICAgICAgICAgICBsZXQgbmV3X3NwZWNpZXNBRE46IFNwZWNpZXNbXSA9IFtdO1xyXG4gICAgICAgICAgICBuZXdfc3BlY2llc0FETi5wdXNoKHNwZWNpZXNBRE5bMF0pO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IG51bV9zcGVjaWVzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG5ld19zcGVjaWVzQUROLnB1c2gobmV3U3BlY2llcyhzcGVjaWVzQUROLCBzY29yZXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcGVjaWVzQUROID0gbmV3X3NwZWNpZXNBRE47XHJcbiAgICAgICAgICAgIGxldCBtZWRpYW4gPSBzY29yZXNbbnVtX3NwZWNpZXMgLyAyXTtcclxuICAgICAgICAgICAgLy9yZXNldCBzY29yZXNcclxuICAgICAgICAgICAgbGV0IHRvdGFsX3Njb3JlID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fc3BlY2llczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbF9zY29yZSArPSBzY29yZXNbaV07XHJcbiAgICAgICAgICAgICAgICBzY29yZXNbaV0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxhc3RfZ2VuX2F2ZyA9IHRvdGFsX3Njb3JlIC8gbnVtX3NwZWNpZXM7XHJcbiAgICAgICAgICAgIHRvcF9nZW5fYXZnID0gTWF0aC5tYXgodG9wX2dlbl9hdmcsIGxhc3RfZ2VuX2F2Zyk7XHJcbiAgICAgICAgICAgIGhpc3RvcnlfYXZnLnB1c2godG9wX2dlbl9hdmcpO1xyXG4gICAgICAgICAgICAvL2hpc3RvcnlfdG9wID0gYXBwZW5kKGhpc3RvcnlfdG9wLHRvcF9zY29yZSk7IC8vdG9wIGFsbCB0aW1lIGdyYXBoXHJcbiAgICAgICAgICAgIGhpc3RvcnlfdG9wLnB1c2godG9wX3Njb3JlX2dlbik7IC8vdG9wIGVhY2ggZ2VuZXJhdGlvbiBncmFwaFxyXG4gICAgICAgICAgICBoaXN0b3J5X21lZC5wdXNoKG1lZGlhbik7XHJcbiAgICAgICAgICAgIGdlbmVyYXRpb25fYXJyYXkucHVzaChnZW5lcmF0aW9uKTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoZ2VuZXJhdGlvbiA+IDcgJiYgc3RvcCkge1xyXG4gICAgICAgICAgICAgICAgLy9jaGVjayBpZiBlbmQgb2YgZXZvbHV0aW9uXHJcbiAgICAgICAgICAgICAgICAvL2lmIGxhc3QgNyBtZWRpYW4gYXZlcmFnZSBpcyBncmVhdGVyIHRoYW4gbGFzdCBtZWRpYW5cclxuICAgICAgICAgICAgICAgIGxldCBzdW0gPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBzdW0gPSBzdW0gKyBoaXN0b3J5X21lZFtnZW5lcmF0aW9uIC0gMSAtIGldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBhdmVyYWdlID0gc3VtIC8gNztcclxuICAgICAgICAgICAgICAgIGlmIChhdmVyYWdlID49IGhpc3RvcnlfbWVkW2dlbmVyYXRpb24gLSAxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2b2x1dGlvbl9lbmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJOdW0gb2YgU3BlY2llczogXCIgKyBudW1fc3BlY2llcyArIFwiIHdpdGggbXV0YXRpb24gcmF0ZSBvZiBcIiArIG11dGF0aW9uX3JhdGUgKyBcIiBnb3QgYSBzY29yZSBvZiBcIiArICh0b3Bfc2NvcmUgLSBnZW5lcmF0aW9uICsgTWF0aC5tYXgoLi4uaGlzdG9yeV9tZWQpKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vZHJhdyBvbmx5IGFmdGVyIGdlbiAxMDBcclxuICAgICAgICAgICAgLy8gaWYgKGdlbmVyYXRpb24gPT0gMTAwKVxyXG4gICAgICAgICAgICAvLyAgICAgZ3JhcGhpY3NGbGFnID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGxpbmVDaGFydC5zZXRNYXhZKHRvcF9zY29yZSk7XHJcbiAgICAgICAgICAgIG1lZGlhbkNoYXJ0LnNldE1heFkodG9wX3Njb3JlKTtcclxuICAgICAgICAgICAgbGluZUNoYXJ0LnNldERhdGEoZ2VuZXJhdGlvbl9hcnJheSwgaGlzdG9yeV90b3ApO1xyXG4gICAgICAgICAgICBtZWRpYW5DaGFydC5zZXREYXRhKGdlbmVyYXRpb25fYXJyYXksIGhpc3RvcnlfbWVkKTtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZ2VuZXJhdGlvbiArIFwiXFx0fFxcdFwiICsgbGFzdF9nZW5fYXZnICsgXCJcXHR8XFx0XCIgKyBtZWRpYW4gKyBcIlxcdHxcXHRcIiArIHRvcF9zY29yZSk7XHJcbiAgICAgICAgICAgIGdlbmVyYXRpb24rKztcclxuICAgICAgICAgICAgc3BlY2llcyA9IDA7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmcmFtZSsrO1xyXG4gICAgaWYgKGZyYW1lID4gMzAwKVxyXG4gICAgICAgIGxhc3Rfc3Bhd24rKztcclxuXHJcbn1cclxuXHJcbi8vZW5kIG9mIGRyYXcqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlc2V0X2RlZmVuZGVycygpOiB2b2lkIHtcclxuICAgIGZvciAobGV0IGkgPSB0ZWFtLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxyXG4gICAgICAgIHRlYW0uc3BsaWNlKGksIDEpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX2RlZmVuZGVyczsgaSsrKVxyXG4gICAgICAgIHRlYW0ucHVzaChuZXcgRGVmZW5kZXIoaSArIDEsIG51bV9kZWZlbmRlcnMpKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gbWFmaWEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgbWFmaWEuc3BsaWNlKGksIDEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBncmFwaGljcygpOiB2b2lkIHtcclxuICAgIC8vU3RhdGljIEdyYXBoaWNzXHJcbiAgICBsaW5lKDMwMCwgMCwgMzAwLCBqc1BhZ2VIZWlnaHQpO1xyXG4gICAgbGluZSg4MDAsIDAsIDgwMCwganNQYWdlSGVpZ2h0KTtcclxuICAgIGZpbGwoJyMxNzNlNDMnKTtcclxuICAgIHRleHRTaXplKDIwKTtcclxuICAgIHRleHQoXCJHZW5lcmF0aW9uIFwiICsgZ2VuZXJhdGlvbiwgODEwLCAzMCk7XHJcbiAgICB0ZXh0KFwiU3BlY2llczogXCIgKyAoc3BlY2llcyArIDEpICsgXCIvXCIgKyBudW1fc3BlY2llcywgODEwLCA1NSk7XHJcbiAgICB0ZXh0KFwiVG9wIFNjb3JlOiBcIiArIHRvcF9zY29yZSwgODEwLCA4MCk7XHJcbiAgICB0ZXh0U2l6ZSgyMik7XHJcbiAgICB0ZXh0KFwiR2VuZXJhdGlvbiBJbmZvXCIsIDgxMCwgMTE1KTtcclxuICAgIHRleHQoXCJTcGVjaWVzIEluZm9cIiwgODEwLCAyMTApO1xyXG4gICAgdGV4dChcIkxlYWRlcmJvYXJkc1wiLCA4MTAsIDI4NSk7XHJcbiAgICB0ZXh0U2l6ZSgxOCk7XHJcbiAgICB0ZXh0KGBBdmVyYWdlOiAgICAgICAkeyBhcnJheVN1bShzY29yZXMpIC8gc3BlY2llcyB9YCwgODEwLCAxMzUpOyAvL2NoYW5nZSB0byAxXHJcbiAgICB0ZXh0KGBMYXN0IEF2ZXJhZ2U6ICAkeyBsYXN0X2dlbl9hdmd9YCwgODEwLCAxNTUpO1xyXG4gICAgdGV4dChgQmVzdCBBdmVyYWdlOiAgJHt0b3BfZ2VuX2F2Z31gLCA4MTAsIDE3NSk7XHJcbiAgICB0ZXh0KGBDdXJyZW50IFNjb3JlOiAke3Njb3JlfWAsIDgxMCwgMjMwKTtcclxuICAgIHRleHQoYExpdmVzOiAgICAgICAgICR7bGl2ZXN9YCwgODEwLCAyNTApO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG4gICAgICAgIGZpbGwoJyMxNzNlNDMnLCAyNTUgLSAoKGdlbmVyYXRpb24gLSBsZWFkZXJib2FyZFsxXVtpXSkgKiA3KSk7XHJcbiAgICAgICAgaWYgKGxlYWRlcmJvYXJkWzFdW2ldID09IGdlbmVyYXRpb24pIHtcclxuICAgICAgICAgICAgaWYgKGxlYWRlcmJvYXJkWzJdW2ldID09IHNwZWNpZXMpXHJcbiAgICAgICAgICAgICAgICBmaWxsKCcjRDVBMDIxJyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGZpbGwoJyMzZmIwYWMnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGV4dCgoaSArIDEpICsgXCIuIEdlbmVyYXRpb24gXCIgKyBsZWFkZXJib2FyZFsxXVtpXSArIFwiOiBcIiArIGxlYWRlcmJvYXJkWzBdW2ldLCA4MTAsIDMxMCArIGkgKiAyMSk7XHJcbiAgICB9XHJcbiAgICB0ZXh0U2l6ZSgxMik7XHJcbiAgICBsaW5lQ2hhcnQuZHJhdyg4MTAsIDUzNSwgMjcwLCAxNzUpO1xyXG4gICAgbWVkaWFuQ2hhcnQuZHJhdyg4MTAsIDUzNSwgMjcwLCAxNzUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWZpYV9zcGF3bigpOiB2b2lkIHtcclxuICAgIC8vbWFmaWEgc3Bhd25cclxuICAgIGlmIChyYW5kb20oMCwgMSkgPCAobGFzdF9zcGF3biAqIDAuMDAwMSkpIHtcclxuICAgICAgICBsZXQgcmFkaXVzID0gKE1hdGguZXhwKC1mcmFtZSAvIDIwMDAwKSAqIDQwKTtcclxuICAgICAgICBsZXQgdmVsID0gMjtcclxuICAgICAgICBpZiAoZnJhbWUgPiAxMDAwMClcclxuICAgICAgICAgICAgdmVsICs9IGZyYW1lIC8gMTAwMDA7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgU3Bhd246IFJhZGl1czogJHtyYWRpdXN9IFZlbDoke3ZlbH0gICAoRnJhbWU6JHtmcmFtZX0pYCk7XHJcbiAgICAgICAgbWFmaWEucHVzaChuZXcgRW5lbXkocmFkaXVzLCB2ZWwpKTtcclxuICAgICAgICBsYXN0X3NwYXduID0gMDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlX21hZmlhKCk6IHZvaWQge1xyXG5cclxuICAgIGZvciAobGV0IGkgPSBtYWZpYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIG1hZmlhW2ldLnVwZGF0ZVBvcygpO1xyXG4gICAgICAgIGlmIChtYWZpYVtpXS5pbnRlcnNlY3QodGVhbSkpIHtcclxuICAgICAgICAgICAgbWFmaWEuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICBzY29yZSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHBvcyA9IG1hZmlhW2ldLmdldFgoKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSA4MDAgLSBtYWZpYVtpXS5nZXRSYWRpdXMoKSkge1xyXG4gICAgICAgICAgICAgICAgbWFmaWEuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgbGl2ZXMtLTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIC8qaWYgKGdyYXBoaWNzRmxhZykqL1xyXG4gICAgICAgICAgICAgICAgZWxsaXBzZShtYWZpYVtpXS5nZXRYKCksIG1hZmlhW2ldLmdldFkoKSwgbWFmaWFbaV0uZ2V0UmFkaXVzKCksICcjZmFlNTk2Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVfZGVmZW5kZXJzKCk6IHZvaWQge1xyXG4gICAgLy91cGRhdGUgZGVmZW5kZXJzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRlYW0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvKmlmIChncmFwaGljc0ZsYWcpKi8ge1xyXG4gICAgICAgICAgICBlbGxpcHNlKHRlYW1baV0uZ2V0WCgpLCB0ZWFtW2ldLmdldFkoKSwgdGVhbVtpXS5nZXRSYWRpdXMoKSwgJyMzZmIwYWMnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jYWxjdWxlIGlucHV0c1xyXG4gICAgICAgIGxldCBkaXN0OiBudW1iZXJbXSA9IGNyZWF0ZUFycmF5KHRlYW0ubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRlYW0ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGogIT0gaSkge1xyXG4gICAgICAgICAgICAgICAgZGlzdFtqXSA9IGRpc3RhbmNlKHRlYW1baV0uZ2V0WCgpLCB0ZWFtW2ldLmdldFkoKSwgdGVhbVtqXS5nZXRYKCksIHRlYW1bal0uZ2V0WSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBkaXN0W2pdID0gOTk5OTk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjbG9zZXN0ID0gTWF0aC5taW4oLi4uZGlzdCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIjFzdDogXCIgKyBjbG9zZXN0KTtcclxuICAgICAgICBsZXQgaW5kZXgxOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBpbmRleDI6IG51bWJlciA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGNsb3Nlc3QgIT0gZGlzdFtpbmRleDFdKVxyXG4gICAgICAgICAgICBpbmRleDErKztcclxuICAgICAgICBkaXN0W2luZGV4MV0gPSA5OTk5OTtcclxuICAgICAgICBjbG9zZXN0ID0gTWF0aC5taW4oLi4uZGlzdCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIjJuZDogXCIgKyBjbG9zZXN0KTtcclxuICAgICAgICB3aGlsZSAoY2xvc2VzdCAhPSBkaXN0W2luZGV4Ml0pXHJcbiAgICAgICAgICAgIGluZGV4MisrO1xyXG5cclxuICAgICAgICBsZXQgaW5wdXQ6IG51bWJlcltdID0gY3JlYXRlQXJyYXkoMTMpO1xyXG4gICAgICAgIGlucHV0WzBdID0gKHRlYW1baV0uZ2V0WCgpIC0gNjAwKSAvIDIwMC4wMDsgLy9wb3MgeFxyXG4gICAgICAgIGlucHV0WzFdID0gKHRlYW1baV0uZ2V0WSgpKSAvIChqc1BhZ2VIZWlnaHQgLyAyLjAwKTsvL3BvcyB5XHJcbiAgICAgICAgaW5wdXRbMl0gPSB0ZWFtW2ldLmdldFZlbFgoKSAvIDIuMDA7Ly92ZWwgeFxyXG4gICAgICAgIGlucHV0WzNdID0gKHRlYW1baV0uZ2V0VmVsWSgpIC8gMi4wMCk7Ly92ZWwgeVxyXG4gICAgICAgIGlucHV0WzRdID0gKCh0ZWFtW2luZGV4MV0uZ2V0WCgpIC0gNjAwKSAvIDIwMC4wMCkgLSBpbnB1dFswXTtcclxuICAgICAgICBpbnB1dFs1XSA9ICgodGVhbVtpbmRleDFdLmdldFkoKSAvIChqc1BhZ2VIZWlnaHQgLyAyLjAwKSkpIC0gaW5wdXRbMV07XHJcbiAgICAgICAgaW5wdXRbNl0gPSAodGVhbVtpbmRleDFdLmdldFZlbFgoKSAvIDIuMDApIC0gaW5wdXRbMl07XHJcbiAgICAgICAgaW5wdXRbN10gPSAodGVhbVtpbmRleDFdLmdldFZlbFkoKSAvIDIuMDApIC0gaW5wdXRbM107XHJcbiAgICAgICAgaW5wdXRbOF0gPSAoKHRlYW1baW5kZXgyXS5nZXRYKCkgLSA2MDApIC8gMjAwLjAwKSAtIGlucHV0WzBdO1xyXG4gICAgICAgIGlucHV0WzldID0gKCh0ZWFtW2luZGV4Ml0uZ2V0WSgpIC8gKGpzUGFnZUhlaWdodCAvIDIuMDApKSkgLSBpbnB1dFsxXTtcclxuICAgICAgICBpbnB1dFsxMF0gPSAodGVhbVtpbmRleDJdLmdldFZlbFgoKSAvIDIuMDApIC0gaW5wdXRbMl07XHJcbiAgICAgICAgaW5wdXRbMTFdID0gKHRlYW1baW5kZXgyXS5nZXRWZWxZKCkgLyAyLjAwKSAtIGlucHV0WzNdO1xyXG4gICAgICAgIGlucHV0WzEyXSA9IDE7IC8vYmlhc1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKGBpbnB1dDogWDoke2lucHV0WzBdfSBZOiR7aW5wdXRbMV19IFZlbFg6JHtpbnB1dFsyXX0gVmVsWToke2lucHV0WzNdfWApO1xyXG5cclxuICAgICAgICBsZXQgb3V0cHV0OiBudW1iZXJbXSA9IHNwZWNpZXNBRE5bc3BlY2llc10uY2FsY3VsYXRlT3V0cHV0KGlucHV0KTtcclxuICAgICAgICB0ZWFtW2ldLmNoYW5nZV9hY2Mob3V0cHV0WzBdICogbWF4X2FjY192YXJpYXRpb24sIG91dHB1dFsxXSAqIG1heF9hY2NfdmFyaWF0aW9uKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGBYOiAke3RlYW1bMF0uZ2V0WCgpfSBZOiAke3RlYW1bMF0uZ2V0WSgpfWApO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBuZXdTcGVjaWVzKGFuY2VzdG9yOiBTcGVjaWVzW10sIHNjb3JlczogbnVtYmVyW10pOiBTcGVjaWVzIHtcclxuICAgIGxldCBiYWJ5ID0gbmV3IFNwZWNpZXMoZmFsc2UpO1xyXG4gICAgbGV0IHRvdGFsX3Njb3JlID0gMDtcclxuICAgIGxldCBmbG9hdF9zY29yZXM6IG51bWJlcltdID0gY3JlYXRlQXJyYXkobnVtX3NwZWNpZXMpO1xyXG4gICAgLy9ub3JtYWxpemVcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX3NwZWNpZXM7IGkrKykge1xyXG4gICAgICAgIHRvdGFsX3Njb3JlICs9IHNjb3Jlc1tpXSAqKiAyO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX3NwZWNpZXM7IGkrKykge1xyXG4gICAgICAgIGZsb2F0X3Njb3Jlc1tpXSA9IChzY29yZXNbaV0gKiogMikgLyB0b3RhbF9zY29yZTtcclxuICAgIH1cclxuXHJcbiAgICAvL2NhbGN1bGF0ZSBnZW5lc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMzsgaSsrKVxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xyXG4gICAgICAgICAgICBsZXQgciA9IHJhbmRvbSgwLCAxKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKHIgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgciA9IHIgLSBmbG9hdF9zY29yZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbmRleC0tO1xyXG4gICAgICAgICAgICBsZXQgbGF5ZXI6IG51bWJlcltdW10gPSBhbmNlc3RvcltpbmRleF0uZmlyc3RfbGF5ZXI7XHJcbiAgICAgICAgICAgIGJhYnkuc2V0X2xheWVyKDEsIGksIGosIGxheWVyW2ldW2pdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMTsgaSsrKVxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMjsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCByID0gcmFuZG9tKDAsIDEpO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAociA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByID0gciAtIGZsb2F0X3Njb3Jlc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluZGV4LS07XHJcbiAgICAgICAgICAgIGxldCBsYXllcjogbnVtYmVyW11bXSA9IGFuY2VzdG9yW2luZGV4XS5zZWNvbmRfbGF5ZXI7XHJcbiAgICAgICAgICAgIGJhYnkuc2V0X2xheWVyKDIsIGksIGosIGxheWVyW2ldW2pdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgLy9jYWxjdWxhdGUgbXV0YXRpb25zXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEzOyBpKyspXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCByID0gcmFuZG9tKDAsIDEpO1xyXG4gICAgICAgICAgICBpZiAociA8IG11dGF0aW9uX3JhdGUpXHJcbiAgICAgICAgICAgICAgICBiYWJ5LnNldF9sYXllcigxLCBpLCBqLCByYW5kb20oLTEsIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMTsgaSsrKVxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMjsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCByID0gcmFuZG9tKDAsIDEpO1xyXG4gICAgICAgICAgICBpZiAociA8IG11dGF0aW9uX3JhdGUpXHJcbiAgICAgICAgICAgICAgICBiYWJ5LnNldF9sYXllcigyLCBpLCBqLCByYW5kb20oLTEsIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJhYnk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBzb3J0TGVhZGVyYm9hcmQob2xkOiBudW1iZXJbXVtdKTogbnVtYmVyW11bXSB7XHJcbiAgICBsZXQgc29ydGVkOiBudW1iZXJbXVtdID0gY3JlYXRlTWF0cml4KDMsIDEwKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuICAgICAgICBsZXQgbWF4ID0gTWF0aC5tYXgoLi4ub2xkWzBdKTtcclxuICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgIHdoaWxlIChvbGRbMF1baW5kZXhdICE9IG1heClcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICBzb3J0ZWRbMF1baV0gPSBvbGRbMF1baW5kZXhdO1xyXG4gICAgICAgIHNvcnRlZFsxXVtpXSA9IG9sZFsxXVtpbmRleF07XHJcbiAgICAgICAgc29ydGVkWzJdW2ldID0gb2xkWzJdW2luZGV4XTtcclxuICAgICAgICBvbGRbMF1baW5kZXhdID0gLTE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc29ydGVkO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FpX2Nvb3AudHMiLCJpbXBvcnQge2pzUGFnZUhlaWdodCwgbGltaXR9IGZyb20gJy4vaGVscGVycyc7XHJcbmltcG9ydCB7UG9pbnR9IGZyb20gJy4vUG9pbnQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlZmVuZGVyIGV4dGVuZHMgUG9pbnQge1xyXG5cclxuICAgIHJhZGl1cyA9IDM1O1xyXG4gICAgbWF4X2FjYyA9IDAuMTtcclxuICAgIG1heF92ZWwgPSAyO1xyXG5cclxuICAgIGFjY1ggPSAwO1xyXG4gICAgYWNjWSA9IDA7XHJcbiAgICB2ZWxYID0gMDtcclxuICAgIHZlbFkgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKC8qaW50Ki8gY3VycmVudDogbnVtYmVyLCAvKmludCovIHRvdGFsOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vcG9zWCA9IHJhbmRvbSg2MDArcmFkaXVzLDgwMC1yYWRpdXMpO1xyXG4gICAgICAgIC8vcG9zWSA9IHJhbmRvbShyYWRpdXMsIGpzUGFnZUhlaWdodC1yYWRpdXMpO1xyXG4gICAgICAgIHRoaXMucG9zWCA9ICgzMDAgKyB0aGlzLnJhZGl1cyArIDgwMCAtIHRoaXMucmFkaXVzKSAvIDI7XHJcbiAgICAgICAgdGhpcy5wb3NZID0gKGpzUGFnZUhlaWdodCAvIHRvdGFsKSAqIGN1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlX2FjYygvKmZsb2F0Ki8gY2hhbmdlWDogbnVtYmVyLCAvKmZsb2F0Ki8gY2hhbmdlWTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hY2NYICs9IGNoYW5nZVg7XHJcbiAgICAgICAgdGhpcy5hY2NZICs9IGNoYW5nZVk7XHJcbiAgICAgICAgdGhpcy5hY2NYID0gbGltaXQodGhpcy5hY2NYLCB0aGlzLm1heF9hY2MsIC10aGlzLm1heF9hY2MpO1xyXG4gICAgICAgIHRoaXMuYWNjWSA9IGxpbWl0KHRoaXMuYWNjWSwgdGhpcy5tYXhfYWNjLCAtdGhpcy5tYXhfYWNjKTtcclxuXHJcbiAgICAgICAgdGhpcy52ZWxYICs9IHRoaXMuYWNjWDtcclxuICAgICAgICB0aGlzLnZlbFkgKz0gdGhpcy5hY2NZO1xyXG4gICAgICAgIHRoaXMudmVsWCA9IGxpbWl0KHRoaXMudmVsWCwgdGhpcy5tYXhfdmVsLCAtdGhpcy5tYXhfdmVsKTtcclxuICAgICAgICB0aGlzLnZlbFkgPSBsaW1pdCh0aGlzLnZlbFksIHRoaXMubWF4X3ZlbCwgLXRoaXMubWF4X3ZlbCk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWCArPSB0aGlzLnZlbFg7XHJcbiAgICAgICAgdGhpcy5wb3NZICs9IHRoaXMudmVsWTtcclxuICAgICAgICB0aGlzLnBvc1ggPSBsaW1pdCh0aGlzLnBvc1gsIDgwMCAtIHRoaXMucmFkaXVzLCAzMDAgKyB0aGlzLnJhZGl1cyk7XHJcbiAgICAgICAgdGhpcy5wb3NZID0gbGltaXQodGhpcy5wb3NZLCBqc1BhZ2VIZWlnaHQgLSB0aGlzLnJhZGl1cywgdGhpcy5yYWRpdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vdG9kbzogcmVtb3ZlIGdldHRlcnNcclxuICAgIC8qaW50Ki9cclxuICAgIGdldFJhZGl1cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yYWRpdXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyppbnQqL1xyXG4gICAgZ2V0WCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NYO1xyXG4gICAgfVxyXG5cclxuICAgIC8qaW50Ki9cclxuICAgIGdldFZlbFkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmVsWTtcclxuICAgIH1cclxuXHJcbiAgICAvKmludCovXHJcbiAgICBnZXRWZWxYKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZlbFg7XHJcbiAgICB9XHJcblxyXG4gICAgLyppbnQqL1xyXG4gICAgZ2V0WSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NZO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2RlZmVuZGVyLnRzIiwiaW1wb3J0IHsgZGlzdGFuY2UsIGpzUGFnZUhlaWdodCwgcmFuZG9tIH0gZnJvbSAnLi9oZWxwZXJzJztcclxuaW1wb3J0IHsgRGVmZW5kZXIgfSBmcm9tICcuL2RlZmVuZGVyJztcclxuaW1wb3J0IHtQb2ludH0gZnJvbSAnLi9Qb2ludCc7XHJcblxyXG5leHBvcnQgY2xhc3MgRW5lbXkgZXh0ZW5kcyBQb2ludHtcclxuXHJcblx0cmFkaXVzOiBudW1iZXI7XHJcblx0dmVsOiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHI6IG51bWJlciwgdjogbnVtYmVyKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5yYWRpdXMgPSByO1xyXG5cdFx0dGhpcy52ZWwgPSB2O1xyXG5cdFx0dGhpcy5wb3NYID0gLXRoaXMucmFkaXVzO1xyXG5cdFx0dGhpcy5wb3NZID0gcmFuZG9tKHRoaXMucmFkaXVzLCBqc1BhZ2VIZWlnaHQgLSB0aGlzLnJhZGl1cyk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVQb3MoKTogdm9pZCB7XHJcblx0XHR0aGlzLnBvc1ggKz0gdGhpcy52ZWw7XHJcblx0fVxyXG5cclxuXHQvL3RvZG86IHJlbW92ZSBnZXR0ZXJzXHJcblx0Z2V0WCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMucG9zWDtcclxuXHR9XHJcblxyXG5cdGdldFkoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLnBvc1k7XHJcblx0fVxyXG5cclxuXHRnZXRSYWRpdXMoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5yYWRpdXM7XHJcblx0fVxyXG5cclxuXHRpbnRlcnNlY3QodGVhbTogQXJyYXk8RGVmZW5kZXI+KTogYm9vbGVhbiB7Ly9BcnJheUxpc3Q8ZGVmZW5kZXI+IHRlYW1cclxuXHJcblx0XHQvL3RvZG86IGFueVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0ZWFtLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBkaXN0ID0gZGlzdGFuY2UodGhpcy5wb3NYLCB0aGlzLnBvc1ksIHRlYW1baV0uZ2V0WCgpLCB0ZWFtW2ldLmdldFkoKSk7XHJcblx0XHRcdGlmIChkaXN0IDwgKHRoaXMucmFkaXVzICsgdGVhbVtpXS5nZXRSYWRpdXMoKSkpXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VuZW15LnRzIiwiaW1wb3J0IHtyYW5kb219IGZyb20gJy4vaGVscGVycyc7XHJcblxyXG5jb25zdCBoaWRkZW5OZXVyb25zQ291bnQgPSAxMTtcclxuY29uc3Qgb3V0cHV0Q291bnQgPSAyO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNwZWNpZXMge1xyXG5cclxuICAgIC8vdG9kbzogcmVmYWMgbWFrZSBzaXphYmxlP1xyXG4gICAgZmlyc3RfbGF5ZXI6IG51bWJlcltdW107XHJcbiAgICBzZWNvbmRfbGF5ZXI6IG51bWJlcltdW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoaXNSYW5kb206IGJvb2xlYW4pIHsvL2Jvb2xlYW5cclxuXHJcbiAgICAgICAgLy90b2RvOiBsYXllciBzaXplcyB0byB2YXJzXHJcbiAgICAgICAgdGhpcy5maXJzdF9sYXllciA9IFtdO1xyXG4gICAgICAgIC8qbmV3IGZsb2F0WzEzXVsxMF0qL1xyXG4gICAgICAgIHRoaXMuc2Vjb25kX2xheWVyID0gW107XHJcbiAgICAgICAgLypuZXcgZmxvYXRbaGlkZGVuTmV1cm9uc0NvdW50XVtvdXRwdXRDb3VudF0qL1xyXG5cclxuICAgICAgICBpZiAoaXNSYW5kb20pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgLyppbnQqLyBpID0gMDsgaSA8IDEzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RfbGF5ZXJbaV0gPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IC8qaW50Ki8gaiA9IDA7IGogPCAxMDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdF9sYXllcltpXVtqXSA9IHJhbmRvbSgtMSwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IC8qaW50Ki8gaSA9IDA7IGkgPCBoaWRkZW5OZXVyb25zQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRfbGF5ZXJbaV0gPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IC8qaW50Ki8gaiA9IDA7IGogPCBvdXRwdXRDb3VudDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRfbGF5ZXJbaV1bal0gPSByYW5kb20oLTEsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNhbGN1bGF0ZU91dHB1dChpbnB1dDogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgbGV0IGhpZGRlbiA9IG5ldyBBcnJheShoaWRkZW5OZXVyb25zQ291bnQpLmZpbGwoMCk7XHJcbiAgICAgICAgbGV0IG91dHB1dCA9IG5ldyBBcnJheShvdXRwdXRDb3VudCkuZmlsbCgwKTtcclxuXHJcbiAgICAgICAgaGlkZGVuW2hpZGRlbk5ldXJvbnNDb3VudCAtIDFdID0gMTsgLy9iaWFzXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRpb25Gbih2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuICgyIC8gKDEgKyBNYXRoLmV4cCgtMiAqIHZhbHVlKSkpIC0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdG9kbzogcmVmYWNcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaGlkZGVuW2ldICs9IGlucHV0W2pdICogdGhpcy5maXJzdF9sYXllcltqXVtpXTtcclxuICAgICAgICAgICAgICAgIC8vYWN0aXZhdGlvbiBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgaGlkZGVuW2ldID0gYWN0aXZhdGlvbkZuKGhpZGRlbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTE7IGorKykge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0W2ldICs9IGhpZGRlbltqXSAqIHRoaXMuc2Vjb25kX2xheWVyW2pdW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9hY3RpdmF0aW9uIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbaV0gPSBhY3RpdmF0aW9uRm4ob3V0cHV0W2ldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldF9sYXllcihsYXllcjogbnVtYmVyLCBpOiBudW1iZXIsIGo6IG51bWJlciwgdmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIC8vdG9kbzogcmVmYWNcclxuICAgICAgICBpZiAobGF5ZXIgPT09IDEpXHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RfbGF5ZXJbaV1bal0gPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGxheWVyID09PSAyKVxyXG4gICAgICAgICAgICB0aGlzLnNlY29uZF9sYXllcltpXVtqXSA9IHZhbHVlO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NwZWNpZXMudHMiLCJleHBvcnQgY2xhc3MgWFlDaGFydCB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJ0cyBub3QgaW1wbCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGEoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1pblkoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1heFkoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1pblgoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1heFgoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dYQXhpcyguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1lBeGlzKC4uLmFyZ3MpIHtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb2ludFNpemUoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldExpbmVXaWR0aCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0WEF4aXNMYWJlbCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0WUZvcm1hdCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0WEZvcm1hdCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TGluZUNvbG91ciguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UG9pbnRDb2xvdXIoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoLi4uYXJncykge1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3h5Q2hhcnQudHMiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMC0xIS4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTAtMiEuL3N0eWxlcy5sZXNzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTAtMSEuLi9ub2RlX21vZHVsZXMvbGVzcy1sb2FkZXIvbGliL2xvYWRlci5qcz8/cmVmLS0wLTIhLi9zdHlsZXMubGVzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMC0xIS4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTAtMiEuL3N0eWxlcy5sZXNzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMubGVzc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xudmFyIHN0eWxlc0luRG9tID0ge30sXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fTtcblx0fSxcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIC9tc2llIFs2LTldXFxiLy50ZXN0KHNlbGYubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcblx0fSksXG5cdGdldEhlYWRFbGVtZW50ID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xuXHR9KSxcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIDxoZWFkPi5cblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QpO1xuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0KSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xuXHR2YXIgaGVhZCA9IGdldEhlYWRFbGVtZW50KCk7XG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXHRzdHlsZUVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cdGxpbmtFbGVtZW50LnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZTtcblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xuXHRcdGlmKG5ld09iaikge1xuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHRpZihzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rRWxlbWVudC5ocmVmO1xuXG5cdGxpbmtFbGVtZW50LmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYylcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9