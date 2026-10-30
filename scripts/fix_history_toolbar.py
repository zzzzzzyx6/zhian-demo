import re
p='C:/Users/huangchenghao/Desktop/zhian-demo/src/modules/exercise.js'
s=open(p,encoding='utf-8').read()
# 只匹配 historyHTML 里“任务状态筛选”select 之后的新建按钮（829），不动死代码 taskList(534)
pat=re.compile(r'(<select aria-label="任务状态筛选"[^>]*>.*?</select>)<button class="btn primary" onclick="App\.attack\.newTask\(\)">\$\{I\(\'plus\',14\)\}新建攻防任务</button></div>')
new,n=pat.subn(r'\1</div>',s)
print('replaced occurrences:',n)
if n:
    open(p,'w',encoding='utf-8').write(new)
    print('written')
else:
    print('NO MATCH - inspect')
