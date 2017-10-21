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
/******/ 	var hotCurrentHash = "647f07982c1cca830cdb"; // eslint-disable-line no-unused-vars
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
/******/ 	return hotCreateRequire(4)(__webpack_require__.s = 4);
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

exports = module.exports = __webpack_require__(10)(true);
// imports


// module
exports.push([module.i, "html,\nbody {\n  height: 100vh;\n  padding: 0;\n  margin: 0;\n}\n", "", {"version":3,"sources":["B:/Projects/nn-coop-balls/src/B:/Projects/nn-coop-balls/src/styles.less","B:/Projects/nn-coop-balls/src/styles.less"],"names":[],"mappings":"AAAA;;EACI,cAAA;EACA,WAAA;EACA,UAAA;CCEH","file":"styles.less","sourcesContent":["html,body{\n    height: 100vh;\n    padding: 0;\n    margin:0;\n}\n\nbody{\n\n}\n\n\ncanvas{\n\n}","html,\nbody {\n  height: 100vh;\n  padding: 0;\n  margin: 0;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__canvasHelper__ = __webpack_require__(3);

class Circle {
    constructor(posX, posY, radius, color) {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        Object(__WEBPACK_IMPORTED_MODULE_0__canvasHelper__["b" /* ellipse */])(this.posX, this.posY, this.radius, this.color);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Circle;



/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__defender__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__enemy__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__species__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__xyChart__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styles_less__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styles_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__styles_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__canvasHelper__ = __webpack_require__(3);
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
        let y = (__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] / num_defenders) * i;
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
        return [...Array(score).fill('💎')].join('') || 0;
    }
    function renderLives(current = 0, max = num_lives) {
        return [...Array(lives).fill('💗'), ...Array(max - lives).fill('🖤')].join('');
    }
    //Static Graphics
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["d" /* line */])(300, 0, 300, __WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */]);
    Object(__WEBPACK_IMPORTED_MODULE_6__canvasHelper__["d" /* line */])(800, 0, 800, __WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */]);
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
    if (Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(0, 1) < (last_spawn * 0.0001)) {
        let radius = (Math.exp(-frame / 20000) * 40);
        let vel = 2;
        if (frame > 10000)
            vel += frame / 10000;
        //console.log(`Spawn: Radius: ${radius} Vel:${vel}   (Frame:${frame})`);
        vel = 10; //todo: remove (debug only)
        let posX = -radius;
        let posY = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["g" /* random */])(radius, __WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] - radius);
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
                dist[j] = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* distance */])(team[i].posX, team[i].posY, team[j].posX, team[j].posY);
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
        input[1] = (team[i].posY) / (__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] / 2.00); //pos y
        input[2] = team[i].velX / 2.00; //vel x
        input[3] = (team[i].velY / 2.00); //vel y
        input[4] = ((team[index1].posX - 600) / 200.00) - input[0];
        input[5] = ((team[index1].posY / (__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] / 2.00))) - input[1];
        input[6] = (team[index1].velX / 2.00) - input[2];
        input[7] = (team[index1].velY / 2.00) - input[3];
        input[8] = ((team[index2].posX - 600) / 200.00) - input[0];
        input[9] = ((team[index2].posY / (__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* jsPageHeight */] / 2.00))) - input[1];
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__circle__ = __webpack_require__(2);


const radius = 35;
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
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Defender;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__circle__ = __webpack_require__(2);


const color = '#fae596';
class Enemy extends __WEBPACK_IMPORTED_MODULE_1__circle__["a" /* Circle */] {
    constructor(posX, posY, radius, v) {
        super(posX, posY, radius, color);
        this.vel = v;
    }
    updatePos() {
        this.posX += this.vel;
    }
    intersect(team) {
        //todo: any
        for (let i = 0; i < team.length; i++) {
            let dist = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* distance */])(this.posX, this.posY, team[i].posX, team[i].posY);
            if (dist < (this.radius + team[i].radius))
                return true;
        }
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Enemy;



/***/ }),
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(11)(content, {});
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
/* 10 */
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
/* 11 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjQ3ZjA3OTgyYzFjY2E4MzBjZGIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hlbHBlcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy5sZXNzIiwid2VicGFjazovLy8uL3NyYy9jaXJjbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NhbnZhc0hlbHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWlfY29vcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGVmZW5kZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VuZW15LnRzIiwid2VicGFjazovLy8uL3NyYy9zcGVjaWVzLnRzIiwid2VicGFjazovLy8uL3NyYy94eUNoYXJ0LnRzIiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMubGVzcz83ZDVlIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0EsV0FBRzs7QUFFSCxvREFBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBLDZCQUE2QixtQkFBbUI7O0FBRWhEOztBQUVBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiIuL2Rpc3QvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0dGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSBcclxuIFx0ZnVuY3Rpb24gd2VicGFja0hvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdFx0aWYocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0fSA7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gXHRcdHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcclxuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xyXG4gXHRcdDtcclxuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QocmVxdWVzdFRpbWVvdXQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHJlcXVlc3RUaW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQgfHwgMTAwMDA7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcclxuIFx0XHRcdFx0cmVxdWVzdC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RQYXRoLCB0cnVlKTtcclxuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQ7XHJcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkgcmV0dXJuO1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdC8vIHRpbWVvdXRcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxyXG4gXHRcdFx0XHRcdHJlc29sdmUoKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG90aGVyIGZhaWx1cmVcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm47XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjY0N2YwNzk4MmMxY2NhODMwY2RiXCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XHJcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XHJcbiBcdFxyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xyXG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXHJcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0aG90VXBkYXRlID0ge307XHJcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IDA7XHJcbiBcdFx0XHR7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9uZS1ibG9ja3NcclxuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cclxuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcclxuIFx0XHRcdHJldHVybjtcclxuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGlmKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcclxuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xyXG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XHJcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XHJcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xyXG4gXHRcdGlmKCFkZWZlcnJlZCkgcmV0dXJuO1xyXG4gXHRcdGlmKGhvdEFwcGx5T25VcGRhdGUpIHtcclxuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXHJcbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cclxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcclxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcclxuIFx0XHRcdH0pLnRoZW4oXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdCk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XHJcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiBcdFxyXG4gXHRcdHZhciBjYjtcclxuIFx0XHR2YXIgaTtcclxuIFx0XHR2YXIgajtcclxuIFx0XHR2YXIgbW9kdWxlO1xyXG4gXHRcdHZhciBtb2R1bGVJZDtcclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcclxuIFx0XHRcdFx0XHRpZDogaWRcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcclxuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fbWFpbikge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdGlmKCFwYXJlbnQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcclxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xyXG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXHJcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxyXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcclxuIFx0XHRcdH07XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XHJcbiBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XHJcbiBcdFx0XHRcdGlmKGEuaW5kZXhPZihpdGVtKSA8IDApXHJcbiBcdFx0XHRcdFx0YS5wdXNoKGl0ZW0pO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcclxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XHJcbiBcdFxyXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XHJcbiBcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCIpO1xyXG4gXHRcdH07XHJcbiBcdFxyXG4gXHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcclxuIFx0XHRcdFx0dmFyIHJlc3VsdDtcclxuIFx0XHRcdFx0aWYoaG90VXBkYXRlW2lkXSkge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcclxuIFx0XHRcdFx0aWYocmVzdWx0LmNoYWluKSB7XHJcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHN3aXRjaChyZXN1bHQudHlwZSkge1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiIGluIFwiICsgcmVzdWx0LnBhcmVudElkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGlzcG9zZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGRlZmF1bHQ6XHJcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGFib3J0RXJyb3IpIHtcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcclxuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9BcHBseSkge1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdFx0XHRcdGZvcihtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0Rpc3Bvc2UpIHtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxyXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiYgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcclxuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xyXG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xyXG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdHZhciBpZHg7XHJcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XHJcbiBcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0aWYoIW1vZHVsZSkgY29udGludWU7XHJcbiBcdFxyXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcclxuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XHJcbiBcdFx0XHRcdGNiKGRhdGEpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcclxuIFx0XHJcbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxyXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcclxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXHJcbiBcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XHJcbiBcdFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XHJcbiBcdFx0XHRcdFx0XHRpZihjYikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihjYWxsYmFja3MuaW5kZXhPZihjYikgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcclxuIFx0XHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XHJcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIyKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JnaW5hbEVycm9yOiBlcnIsIC8vIFRPRE8gcmVtb3ZlIGluIHdlYnBhY2sgNFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyMjtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcclxuIFx0XHRpZihlcnJvcikge1xyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcclxuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XHJcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoNCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjQ3ZjA3OTgyYzFjY2E4MzBjZGIiLCIvL3RvZG86IGdldCBmcm9tIHBhZ2VcclxuZXhwb3J0IGNvbnN0IGpzUGFnZUhlaWdodCA9IDc1MDsvL3RvZG86IHJlbW92ZSFcclxuXHJcbi8vdG9kbzogaW1wbFxyXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2UoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4MSAtIHgyKSAqKiAyICsgKHkxIC0geTIpICoqIDIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tKG1pbjogbnVtYmVyID0gMCwgbWF4OiBudW1iZXIgPSAxKTogbnVtYmVyIHtcclxuICAgIC8vcmFuZ2UgcmFuZG9tXHJcbiAgICByZXR1cm4gbWluICsgTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGltaXQodmFsdWU6IG51bWJlciwgbWF4OiBudW1iZXIsIG1pbjogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmICh2YWx1ZSA8IG1pbikgcmV0dXJuIG1pbjtcclxuICAgIGlmICh2YWx1ZSA+IG1heCkgcmV0dXJuIG1heDtcclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhcnJheVN1bShhcnI6IG51bWJlcltdKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBhcnIucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIGl0ZW0sIDApO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFycmF5KGxlbmd0aDogbnVtYmVyLCB2YWx1ZSA9IDApOiBudW1iZXJbXSB7XHJcbiAgICByZXR1cm4gQXJyYXkobGVuZ3RoKS5maWxsKHZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hdHJpeChyb3dzOiBudW1iZXIsIGNvbHM6IG51bWJlciwgdmFsdWUgPSAwKTogbnVtYmVyW11bXSB7XHJcbiAgICByZXR1cm4gY3JlYXRlQXJyYXkocm93cykubWFwKCgpID0+IGNyZWF0ZUFycmF5KGNvbHMsIHZhbHVlKSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbmYodmFsdWU6IG51bWJlciwgLi4uYXJncykge1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2hlbHBlcnMudHMiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiaHRtbCxcXG5ib2R5IHtcXG4gIGhlaWdodDogMTAwdmg7XFxuICBwYWRkaW5nOiAwO1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiQjovUHJvamVjdHMvbm4tY29vcC1iYWxscy9zcmMvQjovUHJvamVjdHMvbm4tY29vcC1iYWxscy9zcmMvc3R5bGVzLmxlc3NcIixcIkI6L1Byb2plY3RzL25uLWNvb3AtYmFsbHMvc3JjL3N0eWxlcy5sZXNzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOztFQUNJLGNBQUE7RUFDQSxXQUFBO0VBQ0EsVUFBQTtDQ0VIXCIsXCJmaWxlXCI6XCJzdHlsZXMubGVzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCJodG1sLGJvZHl7XFxuICAgIGhlaWdodDogMTAwdmg7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIG1hcmdpbjowO1xcbn1cXG5cXG5ib2R5e1xcblxcbn1cXG5cXG5cXG5jYW52YXN7XFxuXFxufVwiLFwiaHRtbCxcXG5ib2R5IHtcXG4gIGhlaWdodDogMTAwdmg7XFxuICBwYWRkaW5nOiAwO1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj97XCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9saWIvbG9hZGVyLmpzP3tcInNvdXJjZU1hcFwiOnRydWV9IS4vc3JjL3N0eWxlcy5sZXNzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGVsbGlwc2UgfSBmcm9tICcuL2NhbnZhc0hlbHBlcic7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2lyY2xlIHtcclxuXHJcblx0Y29uc3RydWN0b3IocHVibGljIHBvc1g6IG51bWJlciwgcHVibGljIHBvc1k6IG51bWJlcixcclxuXHRcdFx0XHRcdHB1YmxpYyByYWRpdXM6IG51bWJlcixcclxuXHRcdFx0XHRcdHB1YmxpYyBjb2xvcjogc3RyaW5nKSB7XHJcblxyXG5cdH1cclxuXHJcblx0ZHJhdygpIHtcclxuXHRcdGVsbGlwc2UodGhpcy5wb3NYLCB0aGlzLnBvc1ksIHRoaXMucmFkaXVzLCB0aGlzLmNvbG9yKTtcclxuXHR9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2lyY2xlLnRzIiwiY29uc3QgZ2JTaXplID0ge3dpZHRoOiAxMDgwLCBoZWlnaHQ6IDcyMH07XHJcbmNvbnN0IGdiOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lYm9hcmQnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuY29uc3QgY3R4ID0gZ2IuZ2V0Q29udGV4dCgnMmQnKTtcclxuZ2Iud2lkdGggPSBnYlNpemUud2lkdGg7XHJcbmdiLmhlaWdodCA9IGdiU2l6ZS5oZWlnaHQ7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYmFja2dyb3VuZChjb2xvcjogc3RyaW5nKSB7XHJcblx0Y3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG5cdGN0eC5maWxsUmVjdCgwLCAwLCBnYlNpemUud2lkdGgsIGdiU2l6ZS5oZWlnaHQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGluZSh4MSwgeTEsIHgyLCB5Mikge1xyXG5cdGN0eC5iZWdpblBhdGgoKTtcclxuXHRjdHgubW92ZVRvKHgxLCB5MSk7XHJcblx0Y3R4LmxpbmVUbyh4MiwgeTIpO1xyXG5cdGN0eC5zdHJva2UoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVsbGlwc2UoeDEsIHkxLCByYWRpdXMsIGNvbG9yPykge1xyXG5cdGN0eC5iZWdpblBhdGgoKTtcclxuXHRjdHguYXJjKHgxLCB5MSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG5cclxuXHRpZiAoY29sb3IpIHtcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuXHR9XHJcblxyXG5cdGN0eC5maWxsKCk7XHJcblx0Y3R4LmxpbmVXaWR0aCA9IDM7XHJcblx0Y3R4LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcclxuXHRjdHguc3Ryb2tlKCk7XHJcblx0Y3R4LmNsb3NlUGF0aCgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGV4dCh2YWx1ZSwgeCwgeSwgc2l6ZSA9IDIwKSB7XHJcblx0Ly9jdHguZm9udCA9ICcyMHB4IEFyaWFsJztcclxuXHQvL2N0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG5cdGN0eC5maWxsVGV4dCh2YWx1ZSwgeCwgeSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWxsKGNvbG9yLCBhbHBoYSA9IDI1NSkge1xyXG5cdC8vdG9kbzogaW1wbCBhbHBoYVxyXG5cdGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRleHRTaXplKHNpemUpIHtcclxuXHRjdHguZm9udCA9IGAke3NpemV9cHggQXJpYWxgO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NhbnZhc0hlbHBlci50cyIsIi8vaW1wb3J0IG9yZy5naWNlbnRyZS51dGlscy5zdGF0Lio7IC8vdG9kbzogY2hhcnRzIGhlcmVcclxuXHJcblxyXG5pbXBvcnQgeyBhcnJheVN1bSwgY3JlYXRlQXJyYXksIGNyZWF0ZU1hdHJpeCwgZGlzdGFuY2UsIGpzUGFnZUhlaWdodCwgcmFuZG9tIH0gZnJvbSAnLi9oZWxwZXJzJztcclxuXHJcbmltcG9ydCB7IERlZmVuZGVyIH0gZnJvbSAnLi9kZWZlbmRlcic7XHJcbmltcG9ydCB7IEVuZW15IH0gZnJvbSAnLi9lbmVteSc7XHJcbmltcG9ydCB7IFNwZWNpZXMgfSBmcm9tICcuL3NwZWNpZXMnO1xyXG5pbXBvcnQgeyBYWUNoYXJ0IH0gZnJvbSAnLi94eUNoYXJ0JztcclxuXHJcbmltcG9ydCAnLi9zdHlsZXMubGVzcyc7XHJcbmltcG9ydCB7IGJhY2tncm91bmQsIGZpbGwsIGxpbmUsIHRleHQsIHRleHRTaXplIH0gZnJvbSAnLi9jYW52YXNIZWxwZXInO1xyXG5cclxuXHJcbi8vR2xvYmFsXHJcbmxldCBtdXRhdGlvbl9yYXRlID0gMC4wMDU7XHJcbmxldCBzcGVjaWVzVG90YWwgPSAyNTsvL251bV9zcGVjaWVzXHJcbmxldCBtYXhfYWNjX3ZhcmlhdGlvbiA9IDAuMDE7XHJcbmxldCBudW1fZGVmZW5kZXJzID0gNjtcclxubGV0IG51bV9saXZlcyA9IDM7XHJcbmxldCBzdG9wID0gZmFsc2U7XHJcblxyXG5sZXQgZ3JhcGhpY3NGbGFnID0gZmFsc2U7XHJcblxyXG5sZXQgdGVhbTogRGVmZW5kZXJbXSA9IFtdO1xyXG5sZXQgbWFmaWE6IEVuZW15W10gPSBbXTtcclxubGV0IHNwZWNpZXNBRE46IFNwZWNpZXNbXSA9IFtdO1xyXG5sZXQgZ2VuZXJhdGlvbiA9IDE7XHJcbmxldCBsYXN0X3NwYXduID0gMTtcclxubGV0IGZyYW1lID0gMS4wMDtcclxubGV0IGxpdmVzID0gbnVtX2xpdmVzO1xyXG5sZXQgc3BlY2llcyA9IDA7XHJcbmxldCBzY29yZSA9IDA7XHJcbmxldCBzY29yZXM6IG51bWJlcltdID0gY3JlYXRlQXJyYXkoc3BlY2llc1RvdGFsKTtcclxubGV0IHRvcF9zY29yZSA9IDA7XHJcbmxldCB0b3Bfc2NvcmVfZ2VuID0gMDtcclxubGV0IGxhc3RfZ2VuX2F2ZyA9IDA7XHJcbmxldCB0b3BfZ2VuX2F2ZyA9IDA7XHJcbmxldCBsZWFkZXJib2FyZDogbnVtYmVyW11bXSA9IGNyZWF0ZU1hdHJpeCgzLCAxMCk7XHJcbmxldCBsaW5lQ2hhcnQ6IFhZQ2hhcnQ7XHJcbmxldCBtZWRpYW5DaGFydDogWFlDaGFydDtcclxubGV0IGdlbmVyYXRpb25fYXJyYXk6IG51bWJlcltdID0gW107XHJcbmxldCBoaXN0b3J5X2F2ZzogbnVtYmVyW10gPSBbXTtcclxubGV0IGhpc3RvcnlfdG9wOiBudW1iZXJbXSA9IFtdO1xyXG5sZXQgaGlzdG9yeV9tZWQ6IG51bWJlcltdID0gW107XHJcbmxldCAvKlRhYmxlKi8gdGFibGU7XHJcblxyXG5sZXQgZXZvbHV0aW9uX2VuZCA9IGZhbHNlO1xyXG5cclxubGV0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcblxyXG5mdW5jdGlvbiBzZXR1cENoYXJ0cygpIHtcclxuXHRsaW5lQ2hhcnQgPSBuZXcgWFlDaGFydCh0aGlzKTtcclxuXHQvLyBBeGlzIGZvcm1hdHRpbmcgYW5kIGxhYmVscy5cclxuXHRsaW5lQ2hhcnQuc2hvd1hBeGlzKHRydWUpO1xyXG5cdGxpbmVDaGFydC5zaG93WUF4aXModHJ1ZSk7XHJcblx0Ly8gU3ltYm9sIGNvbG91cnNcclxuXHRsaW5lQ2hhcnQuc2V0UG9pbnRTaXplKDIpO1xyXG5cdGxpbmVDaGFydC5zZXRMaW5lV2lkdGgoMik7XHJcblx0bGluZUNoYXJ0LnNldE1pblkoMCk7XHJcblx0bGluZUNoYXJ0LnNldFhBeGlzTGFiZWwoJ0dlbmVyYXRpb24nKTtcclxuXHRsaW5lQ2hhcnQuc2V0WUZvcm1hdCgnIyMjJyk7XHJcblx0bGluZUNoYXJ0LnNldFhGb3JtYXQoJyMjIycpO1xyXG5cclxuXHRtZWRpYW5DaGFydCA9IG5ldyBYWUNoYXJ0KHRoaXMpO1xyXG5cdC8vIEF4aXMgZm9ybWF0dGluZyBhbmQgbGFiZWxzLlxyXG5cdG1lZGlhbkNoYXJ0LnNob3dYQXhpcyh0cnVlKTtcclxuXHRtZWRpYW5DaGFydC5zaG93WUF4aXModHJ1ZSk7XHJcblx0Ly8gU3ltYm9sIGNvbG91cnNcclxuXHRtZWRpYW5DaGFydC5zZXRQb2ludFNpemUoMik7XHJcblx0bWVkaWFuQ2hhcnQuc2V0TGluZVdpZHRoKDIpO1xyXG5cdG1lZGlhbkNoYXJ0LnNldE1pblkoMCk7XHJcblx0bWVkaWFuQ2hhcnQuc2V0WUZvcm1hdCgnIyMjJyk7XHJcblx0bWVkaWFuQ2hhcnQuc2V0WEZvcm1hdCgnIyMjJyk7XHJcblx0bWVkaWFuQ2hhcnQuc2V0WEF4aXNMYWJlbCgnR2VuZXJhdGlvbicpO1xyXG5cdG1lZGlhbkNoYXJ0LnNldExpbmVDb2xvdXIoJyNENUEwMjEnKTtcclxuXHRtZWRpYW5DaGFydC5zZXRQb2ludENvbG91cignI0Q1QTAyMScpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGVmZW5kZXJzKCl7XHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1fZGVmZW5kZXJzOyBpKyspIHtcclxuXHJcblx0XHRsZXQgcmFkaXVzID0gMzU7XHJcblx0XHRsZXQgeCA9KDMwMCArIHJhZGl1cyArIDgwMCAtIHJhZGl1cykgLyAyO1xyXG5cdFx0bGV0IHk9IChqc1BhZ2VIZWlnaHQgLyBudW1fZGVmZW5kZXJzKSAqIGk7XHJcblxyXG5cdFx0bGV0IGRlZmVuZGVyID0gbmV3IERlZmVuZGVyKHgsIHkpO1xyXG5cdFx0dGVhbS5wdXNoKGRlZmVuZGVyKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwKCk6IHZvaWQge1xyXG5cclxuXHRzZXR1cENoYXJ0cygpO1xyXG5cclxuXHQvL2NvbnNvbGUubG9nKFwiR2VuZXJhdGlvblxcdHxcXHRBdmVyYWdlXFx0fFxcdE1lZGlhblxcdHxcXHRUb3AgQWxsIFRpbWVcIik7XHJcblx0Y3JlYXRlRGVmZW5kZXJzKCk7XHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc3BlY2llc1RvdGFsOyBpKyspXHJcblx0XHRzcGVjaWVzQUROLnB1c2gobmV3IFNwZWNpZXModHJ1ZSkpO1xyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuXHRcdGxlYWRlcmJvYXJkWzBdW2ldID0gMDtcclxuXHRcdGxlYWRlcmJvYXJkWzFdW2ldID0gMDtcclxuXHRcdGxlYWRlcmJvYXJkWzJdW2ldID0gMDtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5zZXR1cCgpO1xyXG5kcmF3KCk7XHJcbmNvbnN0IFNFQyA9IDEwMDA7XHJcbmxldCBGUFMgPSAxNjA7XHJcbi8vdG9kbzogZ2FtZWxvb3A/IHVzZSBSQUZcclxuc2V0SW50ZXJ2YWwoKCkgPT4gZHJhdygpLCBTRUMgLyBGUFMpO1xyXG5cclxuZnVuY3Rpb24gZHJhdygpOiB2b2lkIHtcclxuXHJcblx0YmFja2dyb3VuZCgnI2RkZGZkNCcpO1xyXG5cclxuXHRncmFwaGljcygpO1xyXG5cclxuXHR1cGRhdGVfZGVmZW5kZXJzKCk7XHJcblx0dXBkYXRlX21hZmlhKCk7XHJcblx0aWYgKCFldm9sdXRpb25fZW5kKVxyXG5cdFx0bWFmaWFfc3Bhd24oKTtcclxuXHJcblxyXG5cdGlmIChzY29yZSA+PSBsZWFkZXJib2FyZFswXVs5XSkge1xyXG5cdFx0bGV0IG5ld19lbnRyeSA9IHRydWU7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuXHRcdFx0aWYgKGxlYWRlcmJvYXJkWzFdW2ldID09IGdlbmVyYXRpb24gJiYgbGVhZGVyYm9hcmRbMl1baV0gPT0gc3BlY2llcykge1xyXG5cdFx0XHRcdG5ld19lbnRyeSA9IGZhbHNlO1xyXG5cdFx0XHRcdGxlYWRlcmJvYXJkWzBdW2ldID0gc2NvcmU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChuZXdfZW50cnkpIHtcclxuXHRcdFx0bGVhZGVyYm9hcmRbMF1bOV0gPSBzY29yZTtcclxuXHRcdFx0bGVhZGVyYm9hcmRbMV1bOV0gPSBnZW5lcmF0aW9uO1xyXG5cdFx0XHRsZWFkZXJib2FyZFsyXVs5XSA9IHNwZWNpZXM7XHJcblx0XHR9XHJcblx0XHRsZWFkZXJib2FyZCA9IHNvcnRMZWFkZXJib2FyZChsZWFkZXJib2FyZCk7XHJcblx0fVxyXG5cclxuXHQvL2VuZCBvZiBzcGVjaWVzXHJcblx0aWYgKGxpdmVzID09IDApIHtcclxuXHRcdGxpdmVzID0gbnVtX2xpdmVzO1xyXG5cdFx0c2NvcmVzW3NwZWNpZXNdID0gc2NvcmU7XHJcblx0XHR0b3Bfc2NvcmUgPSBNYXRoLm1heCh0b3Bfc2NvcmUsIHNjb3JlKTtcclxuXHRcdHNwZWNpZXMrKztcclxuXHJcblx0XHRzY29yZSA9IDA7XHJcblx0XHRmcmFtZSA9IDA7XHJcblx0XHRsYXN0X3NwYXduID0gMDtcclxuXHRcdHJlc2V0X2RlZmVuZGVycygpO1xyXG5cdFx0aWYgKHNwZWNpZXMgPT09IHNwZWNpZXNUb3RhbCkgLy9lbmQgb2YgZ2VuZXJhdGlvblxyXG5cdFx0e1xyXG5cdFx0XHQvL3Njb3JlIG9yZGVyXHJcblx0XHRcdGxldCBvcmRlcmVkX3Njb3JlczogbnVtYmVyW10gPSBjcmVhdGVBcnJheShzcGVjaWVzVG90YWwpO1xyXG5cdFx0XHRsZXQgb3JkZXJlZF9zcGVjaWVzQUROOiBTcGVjaWVzW10gPSBbXTtcclxuXHRcdFx0LypuZXcgQXJyYXkgPCBTcGVjaWVzID4gKCkqL1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGVjaWVzVG90YWw7IGkrKykge1xyXG5cdFx0XHRcdGxldCB0b3Bfc2NvcmUgPSBNYXRoLm1heCguLi5zY29yZXMpO1xyXG5cdFx0XHRcdGxldCBpbmRleCA9IDA7XHJcblx0XHRcdFx0d2hpbGUgKHNjb3Jlc1tpbmRleF0gIT0gdG9wX3Njb3JlKVxyXG5cdFx0XHRcdFx0aW5kZXgrKztcclxuXHRcdFx0XHRvcmRlcmVkX3Njb3Jlc1tpXSA9IHNjb3Jlc1tpbmRleF07XHJcblx0XHRcdFx0c2NvcmVzW2luZGV4XSA9IC0xO1xyXG5cdFx0XHRcdG9yZGVyZWRfc3BlY2llc0FETi5wdXNoKHNwZWNpZXNBRE5baW5kZXhdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzY29yZXMgPSBvcmRlcmVkX3Njb3JlcztcclxuXHRcdFx0dG9wX3Njb3JlX2dlbiA9IHNjb3Jlc1swXTtcclxuXHRcdFx0c3BlY2llc0FETiA9IG9yZGVyZWRfc3BlY2llc0FETjtcclxuXHRcdFx0Ly9uZXcgc3BlY2llc1xyXG5cdFx0XHRsZXQgbmV3X3NwZWNpZXNBRE46IFNwZWNpZXNbXSA9IFtdO1xyXG5cdFx0XHRuZXdfc3BlY2llc0FETi5wdXNoKHNwZWNpZXNBRE5bMF0pO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMTsgaSA8IHNwZWNpZXNUb3RhbDsgaSsrKSB7XHJcblx0XHRcdFx0bmV3X3NwZWNpZXNBRE4ucHVzaChuZXdTcGVjaWVzKHNwZWNpZXNBRE4sIHNjb3JlcykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHNwZWNpZXNBRE4gPSBuZXdfc3BlY2llc0FETjtcclxuXHRcdFx0bGV0IG1lZGlhbiA9IHNjb3Jlc1tzcGVjaWVzVG90YWwgLyAyXTtcclxuXHRcdFx0Ly9yZXNldCBzY29yZXNcclxuXHRcdFx0bGV0IHRvdGFsX3Njb3JlID0gMDtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGVjaWVzVG90YWw7IGkrKykge1xyXG5cdFx0XHRcdHRvdGFsX3Njb3JlICs9IHNjb3Jlc1tpXTtcclxuXHRcdFx0XHRzY29yZXNbaV0gPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxhc3RfZ2VuX2F2ZyA9IHRvdGFsX3Njb3JlIC8gc3BlY2llc1RvdGFsO1xyXG5cdFx0XHR0b3BfZ2VuX2F2ZyA9IE1hdGgubWF4KHRvcF9nZW5fYXZnLCBsYXN0X2dlbl9hdmcpO1xyXG5cdFx0XHRoaXN0b3J5X2F2Zy5wdXNoKHRvcF9nZW5fYXZnKTtcclxuXHRcdFx0Ly9oaXN0b3J5X3RvcCA9IGFwcGVuZChoaXN0b3J5X3RvcCx0b3Bfc2NvcmUpOyAvL3RvcCBhbGwgdGltZSBncmFwaFxyXG5cdFx0XHRoaXN0b3J5X3RvcC5wdXNoKHRvcF9zY29yZV9nZW4pOyAvL3RvcCBlYWNoIGdlbmVyYXRpb24gZ3JhcGhcclxuXHRcdFx0aGlzdG9yeV9tZWQucHVzaChtZWRpYW4pO1xyXG5cdFx0XHRnZW5lcmF0aW9uX2FycmF5LnB1c2goZ2VuZXJhdGlvbik7XHJcblxyXG5cclxuXHRcdFx0aWYgKGdlbmVyYXRpb24gPiA3ICYmIHN0b3ApIHtcclxuXHRcdFx0XHQvL2NoZWNrIGlmIGVuZCBvZiBldm9sdXRpb25cclxuXHRcdFx0XHQvL2lmIGxhc3QgNyBtZWRpYW4gYXZlcmFnZSBpcyBncmVhdGVyIHRoYW4gbGFzdCBtZWRpYW5cclxuXHRcdFx0XHRsZXQgc3VtID0gMDtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xyXG5cdFx0XHRcdFx0c3VtID0gc3VtICsgaGlzdG9yeV9tZWRbZ2VuZXJhdGlvbiAtIDEgLSBpXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBhdmVyYWdlID0gc3VtIC8gNztcclxuXHRcdFx0XHRpZiAoYXZlcmFnZSA+PSBoaXN0b3J5X21lZFtnZW5lcmF0aW9uIC0gMV0pIHtcclxuXHRcdFx0XHRcdGV2b2x1dGlvbl9lbmQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coXCJOdW0gb2YgU3BlY2llczogXCIgKyBudW1fc3BlY2llcyArIFwiIHdpdGggbXV0YXRpb24gcmF0ZSBvZiBcIiArIG11dGF0aW9uX3JhdGUgKyBcIiBnb3QgYSBzY29yZSBvZiBcIiArICh0b3Bfc2NvcmUgLSBnZW5lcmF0aW9uICsgTWF0aC5tYXgoLi4uaGlzdG9yeV9tZWQpKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL2RyYXcgb25seSBhZnRlciBnZW4gMTAwXHJcblx0XHRcdC8vIGlmIChnZW5lcmF0aW9uID09IDEwMClcclxuXHRcdFx0Ly8gICAgIGdyYXBoaWNzRmxhZyA9IHRydWU7XHJcblxyXG5cdFx0XHRsaW5lQ2hhcnQuc2V0TWF4WSh0b3Bfc2NvcmUpO1xyXG5cdFx0XHRtZWRpYW5DaGFydC5zZXRNYXhZKHRvcF9zY29yZSk7XHJcblx0XHRcdGxpbmVDaGFydC5zZXREYXRhKGdlbmVyYXRpb25fYXJyYXksIGhpc3RvcnlfdG9wKTtcclxuXHRcdFx0bWVkaWFuQ2hhcnQuc2V0RGF0YShnZW5lcmF0aW9uX2FycmF5LCBoaXN0b3J5X21lZCk7XHJcblxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKGdlbmVyYXRpb24gKyBcIlxcdHxcXHRcIiArIGxhc3RfZ2VuX2F2ZyArIFwiXFx0fFxcdFwiICsgbWVkaWFuICsgXCJcXHR8XFx0XCIgKyB0b3Bfc2NvcmUpO1xyXG5cdFx0XHRnZW5lcmF0aW9uKys7XHJcblx0XHRcdHNwZWNpZXMgPSAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnJhbWUrKztcclxuXHRpZiAoZnJhbWUgPiAzMDApXHJcblx0XHRsYXN0X3NwYXduKys7XHJcblxyXG59XHJcblxyXG4vL2VuZCBvZiBkcmF3KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcblxyXG5mdW5jdGlvbiByZXNldF9kZWZlbmRlcnMoKTogdm9pZCB7XHJcblx0Zm9yIChsZXQgaSA9IHRlYW0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcblx0XHR0ZWFtLnNwbGljZShpLCAxKTtcclxuXHJcblx0Y3JlYXRlRGVmZW5kZXJzKCk7XHJcblxyXG5cdGZvciAobGV0IGkgPSBtYWZpYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcclxuXHRcdG1hZmlhLnNwbGljZShpLCAxKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ3JhcGhpY3MoKTogdm9pZCB7XHJcblx0ZnVuY3Rpb24gcmVuZGVyU2NvcmUoc2NvcmUgPSAwKXtcclxuXHRcdHJldHVybiBbLi4uQXJyYXkoc2NvcmUpLmZpbGwoJ/Cfko4nKV0uam9pbignJykgfHwgMDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJlbmRlckxpdmVzKGN1cnJlbnQgPSAwLCBtYXggPSBudW1fbGl2ZXMpe1xyXG5cdFx0cmV0dXJuIFsuLi5BcnJheShsaXZlcykuZmlsbCgn8J+SlycpLCAuLi5BcnJheShtYXgtbGl2ZXMpLmZpbGwoJ/CflqQnKV0uam9pbignJyk7XHJcblx0fVxyXG5cdC8vU3RhdGljIEdyYXBoaWNzXHJcblx0bGluZSgzMDAsIDAsIDMwMCwganNQYWdlSGVpZ2h0KTtcclxuXHRsaW5lKDgwMCwgMCwgODAwLCBqc1BhZ2VIZWlnaHQpO1xyXG5cdGZpbGwoJyMxNzNlNDMnKTtcclxuXHR0ZXh0U2l6ZSgyMCk7XHJcblx0dGV4dCgnR2VuZXJhdGlvbiAnICsgZ2VuZXJhdGlvbiwgODEwLCAzMCk7XHJcblx0dGV4dCgnU3BlY2llczogJyArIChzcGVjaWVzICsgMSkgKyAnLycgKyBzcGVjaWVzVG90YWwsIDgxMCwgNTUpO1xyXG5cdHRleHQoJ1RvcCBTY29yZTogJyArIHRvcF9zY29yZSwgODEwLCA4MCk7XHJcblx0dGV4dFNpemUoMjIpO1xyXG5cdHRleHQoJ0dlbmVyYXRpb24gSW5mbycsIDgxMCwgMTE1KTtcclxuXHR0ZXh0KCdTcGVjaWVzIEluZm8nLCA4MTAsIDIxMCk7XHJcblx0dGV4dCgnTGVhZGVyYm9hcmRzJywgODEwLCAyODUpO1xyXG5cdHRleHRTaXplKDE4KTtcclxuXHR0ZXh0KGBBdmVyYWdlOiAgICAgICAkeyBhcnJheVN1bShzY29yZXMpIC8gc3BlY2llcyB9YCwgODEwLCAxMzUpOyAvL2NoYW5nZSB0byAxXHJcblx0dGV4dChgTGFzdCBBdmVyYWdlOiAgJHsgbGFzdF9nZW5fYXZnfWAsIDgxMCwgMTU1KTtcclxuXHR0ZXh0KGBCZXN0IEF2ZXJhZ2U6ICAke3RvcF9nZW5fYXZnfWAsIDgxMCwgMTc1KTtcclxuXHR0ZXh0KGBDdXJyZW50IFNjb3JlOiAke3JlbmRlclNjb3JlKHNjb3JlKX1gLCA4MTAsIDIzMCk7XHJcblx0dGV4dChg4p2kTGl2ZXM6ICAgICAgICR7cmVuZGVyTGl2ZXMobGl2ZXMsIG51bV9saXZlcyl9YCwgODEwLCAyNTApO1xyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuXHRcdGZpbGwoJyMxNzNlNDMnLCAyNTUgLSAoKGdlbmVyYXRpb24gLSBsZWFkZXJib2FyZFsxXVtpXSkgKiA3KSk7XHJcblx0XHRpZiAobGVhZGVyYm9hcmRbMV1baV0gPT0gZ2VuZXJhdGlvbikge1xyXG5cdFx0XHRpZiAobGVhZGVyYm9hcmRbMl1baV0gPT0gc3BlY2llcylcclxuXHRcdFx0XHRmaWxsKCcjRDVBMDIxJyk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmaWxsKCcjM2ZiMGFjJyk7XHJcblx0XHR9XHJcblx0XHR0ZXh0KChpICsgMSkgKyAnLiBHZW5lcmF0aW9uICcgKyBsZWFkZXJib2FyZFsxXVtpXSArICc6ICcgKyBsZWFkZXJib2FyZFswXVtpXSwgODEwLCAzMTAgKyBpICogMjEpO1xyXG5cdH1cclxuXHR0ZXh0U2l6ZSgxMik7XHJcblxyXG5cdGxpbmVDaGFydC5kcmF3KDgxMCwgNTM1LCAyNzAsIDE3NSk7XHJcblx0bWVkaWFuQ2hhcnQuZHJhdyg4MTAsIDUzNSwgMjcwLCAxNzUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWZpYV9zcGF3bigpOiB2b2lkIHtcclxuXHQvL21hZmlhIHNwYXduXHJcblx0aWYgKHJhbmRvbSgwLCAxKSA8IChsYXN0X3NwYXduICogMC4wMDAxKSkge1xyXG5cdFx0bGV0IHJhZGl1cyA9IChNYXRoLmV4cCgtZnJhbWUgLyAyMDAwMCkgKiA0MCk7XHJcblx0XHRsZXQgdmVsID0gMjtcclxuXHRcdGlmIChmcmFtZSA+IDEwMDAwKVxyXG5cdFx0XHR2ZWwgKz0gZnJhbWUgLyAxMDAwMDtcclxuXHRcdC8vY29uc29sZS5sb2coYFNwYXduOiBSYWRpdXM6ICR7cmFkaXVzfSBWZWw6JHt2ZWx9ICAgKEZyYW1lOiR7ZnJhbWV9KWApO1xyXG5cclxuXHJcblx0XHR2ZWwgPSAxMDsvL3RvZG86IHJlbW92ZSAoZGVidWcgb25seSlcclxuXHJcblx0XHRsZXQgcG9zWCA9IC1yYWRpdXM7XHJcblx0XHRsZXQgcG9zWSA9IHJhbmRvbShyYWRpdXMsIGpzUGFnZUhlaWdodCAtIHJhZGl1cyk7XHJcblxyXG5cdFx0bWFmaWEucHVzaChuZXcgRW5lbXkocG9zWCwgcG9zWSwgcmFkaXVzLCB2ZWwpKTtcclxuXHRcdGxhc3Rfc3Bhd24gPSAwO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlX21hZmlhKCk6IHZvaWQge1xyXG5cclxuXHRmb3IgKGxldCBpID0gbWFmaWEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHRcdG1hZmlhW2ldLnVwZGF0ZVBvcygpO1xyXG5cdFx0aWYgKG1hZmlhW2ldLmludGVyc2VjdCh0ZWFtKSkge1xyXG5cdFx0XHRtYWZpYS5zcGxpY2UoaSwgMSk7IC8vZGVsZXRlXHJcblx0XHRcdHNjb3JlKys7XHJcblx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBwb3MgPSBtYWZpYVtpXS5wb3NYO1xyXG5cdFx0aWYgKHBvcyA+PSA4MDAgLSBtYWZpYVtpXS5yYWRpdXMpIHtcclxuXHRcdFx0bWFmaWEuc3BsaWNlKGksIDEpOyAvL2RlbGV0ZVxyXG5cdFx0XHRsaXZlcy0tO1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHJcblx0XHRtYWZpYVtpXS5kcmF3KCk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVfZGVmZW5kZXJzKCk6IHZvaWQge1xyXG5cdC8vdXBkYXRlIGRlZmVuZGVyc1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdGVhbS5sZW5ndGg7IGkrKykge1xyXG5cdFx0dGVhbVtpXS5kcmF3KCk7XHJcblx0XHQvL2NhbGN1bGUgaW5wdXRzXHJcblx0XHRsZXQgZGlzdDogbnVtYmVyW10gPSBjcmVhdGVBcnJheSh0ZWFtLmxlbmd0aCk7XHJcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHRlYW0ubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0aWYgKGogIT0gaSkge1xyXG5cdFx0XHRcdGRpc3Rbal0gPSBkaXN0YW5jZSh0ZWFtW2ldLnBvc1gsIHRlYW1baV0ucG9zWSwgdGVhbVtqXS5wb3NYLCB0ZWFtW2pdLnBvc1kpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRkaXN0W2pdID0gOTk5OTk7XHJcblx0XHR9XHJcblx0XHRsZXQgY2xvc2VzdCA9IE1hdGgubWluKC4uLmRpc3QpO1xyXG5cdFx0Ly9jb25zb2xlLmxvZyhcIjFzdDogXCIgKyBjbG9zZXN0KTtcclxuXHRcdGxldCBpbmRleDE6IG51bWJlciA9IDA7XHJcblx0XHRsZXQgaW5kZXgyOiBudW1iZXIgPSAwO1xyXG5cdFx0d2hpbGUgKGNsb3Nlc3QgIT0gZGlzdFtpbmRleDFdKVxyXG5cdFx0XHRpbmRleDErKztcclxuXHRcdGRpc3RbaW5kZXgxXSA9IDk5OTk5O1xyXG5cdFx0Y2xvc2VzdCA9IE1hdGgubWluKC4uLmRpc3QpO1xyXG5cdFx0Ly9jb25zb2xlLmxvZyhcIjJuZDogXCIgKyBjbG9zZXN0KTtcclxuXHRcdHdoaWxlIChjbG9zZXN0ICE9IGRpc3RbaW5kZXgyXSlcclxuXHRcdFx0aW5kZXgyKys7XHJcblxyXG5cdFx0bGV0IGlucHV0OiBudW1iZXJbXSA9IGNyZWF0ZUFycmF5KDEzKTtcclxuXHRcdGlucHV0WzBdID0gKHRlYW1baV0ucG9zWCAtIDYwMCkgLyAyMDAuMDA7IC8vcG9zIHhcclxuXHRcdGlucHV0WzFdID0gKHRlYW1baV0ucG9zWSkgLyAoanNQYWdlSGVpZ2h0IC8gMi4wMCk7Ly9wb3MgeVxyXG5cdFx0aW5wdXRbMl0gPSB0ZWFtW2ldLnZlbFggLyAyLjAwOy8vdmVsIHhcclxuXHRcdGlucHV0WzNdID0gKHRlYW1baV0udmVsWSAvIDIuMDApOy8vdmVsIHlcclxuXHRcdGlucHV0WzRdID0gKCh0ZWFtW2luZGV4MV0ucG9zWCAtIDYwMCkgLyAyMDAuMDApIC0gaW5wdXRbMF07XHJcblx0XHRpbnB1dFs1XSA9ICgodGVhbVtpbmRleDFdLnBvc1kgLyAoanNQYWdlSGVpZ2h0IC8gMi4wMCkpKSAtIGlucHV0WzFdO1xyXG5cdFx0aW5wdXRbNl0gPSAodGVhbVtpbmRleDFdLnZlbFggLyAyLjAwKSAtIGlucHV0WzJdO1xyXG5cdFx0aW5wdXRbN10gPSAodGVhbVtpbmRleDFdLnZlbFkgLyAyLjAwKSAtIGlucHV0WzNdO1xyXG5cdFx0aW5wdXRbOF0gPSAoKHRlYW1baW5kZXgyXS5wb3NYIC0gNjAwKSAvIDIwMC4wMCkgLSBpbnB1dFswXTtcclxuXHRcdGlucHV0WzldID0gKCh0ZWFtW2luZGV4Ml0ucG9zWSAvIChqc1BhZ2VIZWlnaHQgLyAyLjAwKSkpIC0gaW5wdXRbMV07XHJcblx0XHRpbnB1dFsxMF0gPSAodGVhbVtpbmRleDJdLnZlbFggLyAyLjAwKSAtIGlucHV0WzJdO1xyXG5cdFx0aW5wdXRbMTFdID0gKHRlYW1baW5kZXgyXS52ZWxZIC8gMi4wMCkgLSBpbnB1dFszXTtcclxuXHRcdGlucHV0WzEyXSA9IDE7IC8vYmlhc1xyXG5cclxuXHRcdC8vY29uc29sZS5sb2coYGlucHV0OiBYOiR7aW5wdXRbMF19IFk6JHtpbnB1dFsxXX0gVmVsWDoke2lucHV0WzJdfSBWZWxZOiR7aW5wdXRbM119YCk7XHJcblxyXG5cdFx0bGV0IG91dHB1dDogbnVtYmVyW10gPSBzcGVjaWVzQUROW3NwZWNpZXNdLmNhbGN1bGF0ZU91dHB1dChpbnB1dCk7XHJcblx0XHR0ZWFtW2ldLmNoYW5nZV9hY2Mob3V0cHV0WzBdICogbWF4X2FjY192YXJpYXRpb24sIG91dHB1dFsxXSAqIG1heF9hY2NfdmFyaWF0aW9uKTtcclxuXHRcdC8vY29uc29sZS5sb2coYFg6ICR7dGVhbVswXS5wb3NYfSBZOiAke3RlYW1bMF0ucG9zWX1gKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5ld1NwZWNpZXMoYW5jZXN0b3I6IFNwZWNpZXNbXSwgc2NvcmVzOiBudW1iZXJbXSk6IFNwZWNpZXMge1xyXG5cdGxldCBiYWJ5ID0gbmV3IFNwZWNpZXMoZmFsc2UpO1xyXG5cdGxldCB0b3RhbF9zY29yZSA9IDA7XHJcblx0bGV0IGZsb2F0X3Njb3JlczogbnVtYmVyW10gPSBjcmVhdGVBcnJheShzcGVjaWVzVG90YWwpO1xyXG5cdC8vbm9ybWFsaXplXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzcGVjaWVzVG90YWw7IGkrKykge1xyXG5cdFx0dG90YWxfc2NvcmUgKz0gc2NvcmVzW2ldICoqIDI7XHJcblx0fVxyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHNwZWNpZXNUb3RhbDsgaSsrKSB7XHJcblx0XHRmbG9hdF9zY29yZXNbaV0gPSAoc2NvcmVzW2ldICoqIDIpIC8gdG90YWxfc2NvcmU7XHJcblx0fVxyXG5cclxuXHQvL2NhbGN1bGF0ZSBnZW5lc1xyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMTM7IGkrKylcclxuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xyXG5cdFx0XHRsZXQgciA9IHJhbmRvbSgwLCAxKTtcclxuXHRcdFx0bGV0IGluZGV4ID0gMDtcclxuXHRcdFx0d2hpbGUgKHIgPj0gMCkge1xyXG5cdFx0XHRcdHIgPSByIC0gZmxvYXRfc2NvcmVzW2luZGV4XTtcclxuXHRcdFx0XHRpbmRleCsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGluZGV4LS07XHJcblx0XHRcdGxldCBsYXllcjogbnVtYmVyW11bXSA9IGFuY2VzdG9yW2luZGV4XS5maXJzdF9sYXllcjtcclxuXHRcdFx0YmFieS5zZXRfbGF5ZXIoMSwgaSwgaiwgbGF5ZXJbaV1bal0pO1xyXG5cdFx0fVxyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IDExOyBpKyspXHJcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IDI7IGorKykge1xyXG5cdFx0XHRsZXQgciA9IHJhbmRvbSgwLCAxKTtcclxuXHRcdFx0bGV0IGluZGV4ID0gMDtcclxuXHRcdFx0d2hpbGUgKHIgPj0gMCkge1xyXG5cdFx0XHRcdHIgPSByIC0gZmxvYXRfc2NvcmVzW2luZGV4XTtcclxuXHRcdFx0XHRpbmRleCsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGluZGV4LS07XHJcblx0XHRcdGxldCBsYXllcjogbnVtYmVyW11bXSA9IGFuY2VzdG9yW2luZGV4XS5zZWNvbmRfbGF5ZXI7XHJcblx0XHRcdGJhYnkuc2V0X2xheWVyKDIsIGksIGosIGxheWVyW2ldW2pdKTtcclxuXHRcdH1cclxuXHJcblx0Ly9jYWxjdWxhdGUgbXV0YXRpb25zXHJcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxMzsgaSsrKVxyXG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XHJcblx0XHRcdGxldCByID0gcmFuZG9tKDAsIDEpO1xyXG5cdFx0XHRpZiAociA8IG11dGF0aW9uX3JhdGUpXHJcblx0XHRcdFx0YmFieS5zZXRfbGF5ZXIoMSwgaSwgaiwgcmFuZG9tKC0xLCAxKSk7XHJcblx0XHR9XHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMTE7IGkrKylcclxuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgMjsgaisrKSB7XHJcblx0XHRcdGxldCByID0gcmFuZG9tKDAsIDEpO1xyXG5cdFx0XHRpZiAociA8IG11dGF0aW9uX3JhdGUpXHJcblx0XHRcdFx0YmFieS5zZXRfbGF5ZXIoMiwgaSwgaiwgcmFuZG9tKC0xLCAxKSk7XHJcblx0XHR9XHJcblxyXG5cdHJldHVybiBiYWJ5O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gc29ydExlYWRlcmJvYXJkKG9sZDogbnVtYmVyW11bXSk6IG51bWJlcltdW10ge1xyXG5cdGxldCBzb3J0ZWQ6IG51bWJlcltdW10gPSBjcmVhdGVNYXRyaXgoMywgMTApO1xyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcclxuXHRcdGxldCBtYXggPSBNYXRoLm1heCguLi5vbGRbMF0pO1xyXG5cdFx0bGV0IGluZGV4ID0gMDtcclxuXHRcdHdoaWxlIChvbGRbMF1baW5kZXhdICE9IG1heClcclxuXHRcdFx0aW5kZXgrKztcclxuXHRcdHNvcnRlZFswXVtpXSA9IG9sZFswXVtpbmRleF07XHJcblx0XHRzb3J0ZWRbMV1baV0gPSBvbGRbMV1baW5kZXhdO1xyXG5cdFx0c29ydGVkWzJdW2ldID0gb2xkWzJdW2luZGV4XTtcclxuXHRcdG9sZFswXVtpbmRleF0gPSAtMTtcclxuXHR9XHJcblx0cmV0dXJuIHNvcnRlZDtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9haV9jb29wLnRzIiwiaW1wb3J0IHsganNQYWdlSGVpZ2h0LCBsaW1pdCB9IGZyb20gJy4vaGVscGVycyc7XHJcbmltcG9ydCB7IENpcmNsZSB9IGZyb20gJy4vY2lyY2xlJztcclxuXHJcbmNvbnN0IHJhZGl1cyA9IDM1O1xyXG5jb25zdCBjb2xvciA9ICcjM2ZiMGFjJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEZWZlbmRlciBleHRlbmRzIENpcmNsZSB7XHJcblxyXG5cdG1heF9hY2MgPSAwLjE7XHJcblx0bWF4X3ZlbCA9IDI7XHJcblxyXG5cdGFjY1ggPSAwO1xyXG5cdGFjY1kgPSAwO1xyXG5cdHZlbFggPSAwO1xyXG5cdHZlbFkgPSAwO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihwb3NYOm51bWJlciwgcG9zWTpudW1iZXIpIHtcclxuXHRcdHN1cGVyKHBvc1gsIHBvc1ksIHJhZGl1cywgY29sb3IpO1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlX2FjYyhjaGFuZ2VYOiBudW1iZXIsIGNoYW5nZVk6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0dGhpcy5hY2NYICs9IGNoYW5nZVg7XHJcblx0XHR0aGlzLmFjY1kgKz0gY2hhbmdlWTtcclxuXHRcdHRoaXMuYWNjWCA9IGxpbWl0KHRoaXMuYWNjWCwgdGhpcy5tYXhfYWNjLCAtdGhpcy5tYXhfYWNjKTtcclxuXHRcdHRoaXMuYWNjWSA9IGxpbWl0KHRoaXMuYWNjWSwgdGhpcy5tYXhfYWNjLCAtdGhpcy5tYXhfYWNjKTtcclxuXHJcblx0XHR0aGlzLnZlbFggKz0gdGhpcy5hY2NYO1xyXG5cdFx0dGhpcy52ZWxZICs9IHRoaXMuYWNjWTtcclxuXHRcdHRoaXMudmVsWCA9IGxpbWl0KHRoaXMudmVsWCwgdGhpcy5tYXhfdmVsLCAtdGhpcy5tYXhfdmVsKTtcclxuXHRcdHRoaXMudmVsWSA9IGxpbWl0KHRoaXMudmVsWSwgdGhpcy5tYXhfdmVsLCAtdGhpcy5tYXhfdmVsKTtcclxuXHJcblx0XHR0aGlzLnBvc1ggKz0gdGhpcy52ZWxYO1xyXG5cdFx0dGhpcy5wb3NZICs9IHRoaXMudmVsWTtcclxuXHRcdHRoaXMucG9zWCA9IGxpbWl0KHRoaXMucG9zWCwgODAwIC0gdGhpcy5yYWRpdXMsIDMwMCArIHRoaXMucmFkaXVzKTtcclxuXHRcdHRoaXMucG9zWSA9IGxpbWl0KHRoaXMucG9zWSwganNQYWdlSGVpZ2h0IC0gdGhpcy5yYWRpdXMsIHRoaXMucmFkaXVzKTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZGVmZW5kZXIudHMiLCJpbXBvcnQgeyBkaXN0YW5jZSwganNQYWdlSGVpZ2h0LCByYW5kb20gfSBmcm9tICcuL2hlbHBlcnMnO1xyXG5pbXBvcnQgeyBEZWZlbmRlciB9IGZyb20gJy4vZGVmZW5kZXInO1xyXG5pbXBvcnQge0NpcmNsZX0gZnJvbSAnLi9jaXJjbGUnO1xyXG5pbXBvcnQgeyBlbGxpcHNlIH0gZnJvbSAnLi9jYW52YXNIZWxwZXInO1xyXG5cclxuXHJcbmNvbnN0IGNvbG9yID0gJyNmYWU1OTYnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBFbmVteSBleHRlbmRzIENpcmNsZXtcclxuXHJcblx0dmVsOiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHBvc1gsIHBvc1ksIHJhZGl1czogbnVtYmVyLCB2OiBudW1iZXIpIHtcclxuXHRcdHN1cGVyKHBvc1gsIHBvc1ksIHJhZGl1cywgY29sb3IpO1xyXG5cclxuXHRcdHRoaXMudmVsID0gdjtcclxuXHJcblx0fVxyXG5cclxuXHR1cGRhdGVQb3MoKTogdm9pZCB7XHJcblx0XHR0aGlzLnBvc1ggKz0gdGhpcy52ZWw7XHJcblx0fVxyXG5cclxuXHRpbnRlcnNlY3QodGVhbTogQXJyYXk8RGVmZW5kZXI+KTogYm9vbGVhbiB7Ly9BcnJheUxpc3Q8ZGVmZW5kZXI+IHRlYW1cclxuXHJcblx0XHQvL3RvZG86IGFueVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0ZWFtLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBkaXN0ID0gZGlzdGFuY2UodGhpcy5wb3NYLCB0aGlzLnBvc1ksIHRlYW1baV0ucG9zWCwgdGVhbVtpXS5wb3NZKTtcclxuXHRcdFx0aWYgKGRpc3QgPCAodGhpcy5yYWRpdXMgKyB0ZWFtW2ldLnJhZGl1cykpXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VuZW15LnRzIiwiaW1wb3J0IHtjcmVhdGVNYXRyaXgsIHJhbmRvbX0gZnJvbSAnLi9oZWxwZXJzJztcclxuXHJcbmNvbnN0IGhpZGRlbk5ldXJvbnNDb3VudCA9IDExO1xyXG5jb25zdCBvdXRwdXRDb3VudCA9IDI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3BlY2llcyB7XHJcblxyXG4gICAgLy90b2RvOiByZWZhYyBtYWtlIHNpemFibGU/XHJcbiAgICBmaXJzdF9sYXllcjogbnVtYmVyW11bXTtcclxuICAgIHNlY29uZF9sYXllcjogbnVtYmVyW11bXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihpc1JhbmRvbTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICAvL3RvZG86IGxheWVyIHNpemVzIHRvIHZhcnNcclxuICAgICAgICB0aGlzLmZpcnN0X2xheWVyID0gY3JlYXRlTWF0cml4KDEzLCAxMCk7XHJcbiAgICAgICAgdGhpcy5zZWNvbmRfbGF5ZXIgPSBjcmVhdGVNYXRyaXgoaGlkZGVuTmV1cm9uc0NvdW50LCBvdXRwdXRDb3VudCk7XHJcblxyXG4gICAgICAgIGlmIChpc1JhbmRvbSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCAvKmludCovIGkgPSAwOyBpIDwgMTM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJzdF9sYXllcltpXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgLyppbnQqLyBqID0gMDsgaiA8IDEwOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0X2xheWVyW2ldW2pdID0gcmFuZG9tKC0xLCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgLyppbnQqLyBpID0gMDsgaSA8IGhpZGRlbk5ldXJvbnNDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlY29uZF9sYXllcltpXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgLyppbnQqLyBqID0gMDsgaiA8IG91dHB1dENvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY29uZF9sYXllcltpXVtqXSA9IHJhbmRvbSgtMSwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2FsY3VsYXRlT3V0cHV0KGlucHV0OiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICBsZXQgaGlkZGVuID0gbmV3IEFycmF5KGhpZGRlbk5ldXJvbnNDb3VudCkuZmlsbCgwKTtcclxuICAgICAgICBsZXQgb3V0cHV0ID0gbmV3IEFycmF5KG91dHB1dENvdW50KS5maWxsKDApO1xyXG5cclxuICAgICAgICBoaWRkZW5baGlkZGVuTmV1cm9uc0NvdW50IC0gMV0gPSAxOyAvL2JpYXNcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGlvbkZuKHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gKDIgLyAoMSArIE1hdGguZXhwKC0yICogdmFsdWUpKSkgLSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy90b2RvOiByZWZhY1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMzsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBoaWRkZW5baV0gKz0gaW5wdXRbal0gKiB0aGlzLmZpcnN0X2xheWVyW2pdW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9hY3RpdmF0aW9uIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICBoaWRkZW5baV0gPSBhY3RpdmF0aW9uRm4oaGlkZGVuW2ldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRbaV0gKz0gaGlkZGVuW2pdICogdGhpcy5zZWNvbmRfbGF5ZXJbal1baV07XHJcbiAgICAgICAgICAgICAgICAvL2FjdGl2YXRpb24gZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgIG91dHB1dFtpXSA9IGFjdGl2YXRpb25GbihvdXRwdXRbaV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0X2xheWVyKGxheWVyOiBudW1iZXIsIGk6IG51bWJlciwgajogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy90b2RvOiByZWZhY1xyXG4gICAgICAgIGlmIChsYXllciA9PT0gMSlcclxuICAgICAgICAgICAgdGhpcy5maXJzdF9sYXllcltpXVtqXSA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAobGF5ZXIgPT09IDIpXHJcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kX2xheWVyW2ldW2pdID0gdmFsdWU7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3BlY2llcy50cyIsImV4cG9ydCBjbGFzcyBYWUNoYXJ0IHtcclxuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2hhcnRzIG5vdCBpbXBsJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0YSguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TWluWSguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TWF4WSguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TWluWCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TWF4WCguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1hBeGlzKC4uLmFyZ3MpIHtcclxuICAgIH1cclxuXHJcbiAgICBzaG93WUF4aXMoLi4uYXJncykge1xyXG4gICAgfVxyXG5cclxuICAgIHNldFBvaW50U2l6ZSguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TGluZVdpZHRoKC4uLmFyZ3MpIHtcclxuICAgIH1cclxuXHJcbiAgICBzZXRYQXhpc0xhYmVsKC4uLmFyZ3MpIHtcclxuICAgIH1cclxuXHJcbiAgICBzZXRZRm9ybWF0KC4uLmFyZ3MpIHtcclxuICAgIH1cclxuXHJcbiAgICBzZXRYRm9ybWF0KC4uLmFyZ3MpIHtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMaW5lQ29sb3VyKC4uLmFyZ3MpIHtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb2ludENvbG91ciguLi5hcmdzKSB7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyguLi5hcmdzKSB7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMveHlDaGFydC50cyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0wLTEhLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tMC0yIS4vc3R5bGVzLmxlc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMC0xIS4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9saWIvbG9hZGVyLmpzPz9yZWYtLTAtMiEuL3N0eWxlcy5sZXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0wLTEhLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/P3JlZi0tMC0yIS4vc3R5bGVzLmxlc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlcy5sZXNzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xudmFyIHN0eWxlc0luRG9tID0ge30sXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fTtcblx0fSxcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIC9tc2llIFs2LTldXFxiLy50ZXN0KHNlbGYubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcblx0fSksXG5cdGdldEhlYWRFbGVtZW50ID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xuXHR9KSxcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIDxoZWFkPi5cblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QpO1xuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0KSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xuXHR2YXIgaGVhZCA9IGdldEhlYWRFbGVtZW50KCk7XG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXHRzdHlsZUVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cdGxpbmtFbGVtZW50LnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZTtcblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xuXHRcdGlmKG5ld09iaikge1xuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHRpZihzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rRWxlbWVudC5ocmVmO1xuXG5cdGxpbmtFbGVtZW50LmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYylcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9