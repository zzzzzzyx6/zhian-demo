import re, glob, os
ROOT='C:/Users/huangchenghao/Desktop/zhian-demo/src/modules'
targets={
 'exercise.js':[219,222,267,678,2461],
 'policy.js':[133,139,218],
}
for fn,lines in targets.items():
    p=os.path.join(ROOT,fn)
    src=open(p,encoding='utf-8').read().split('\n')
    print('==== %s ===='%fn)
    for ln in lines:
        line=src[ln-1]
        i=line.find('setup-page-head')
        seg=line[max(0,i-10):i+400]
        print('L%d: %s'%(ln, seg.replace('\n',' ')))
        print('-'*60)
