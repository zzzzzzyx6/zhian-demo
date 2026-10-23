/* Keep historical payloads intact while displaying the shared asset taxonomy. */
(function(){
'use strict';
const A=window.App,C=A.connections,X=A.attack;
const rows=X.modelResultRows;
X.modelResultRows=function(){return rows.apply(X,arguments).map(row=>({...row,family:C.resultIdentity(row.task).family||'未分组'}));};
const identity=C.identity;
C.identity=function(m){const value=identity(m);return {...value,version:value.version||m?.model||''};};
})();
