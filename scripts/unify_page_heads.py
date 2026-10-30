# -*- coding: utf-8 -*-
"""统一页面头：wb-heading / attack-detail-top 全部改为 .page-heading 标准"""
import io

def apply(path, repls):
    txt = io.open(path, encoding='utf-8').read()
    for old, new, n in repls:
        c = txt.count(old)
        assert c == n, f"{path}: expect {n} got {c} for: {old[:70]}"
        txt = txt.replace(old, new)
    io.open(path, 'w', encoding='utf-8', newline='').write(txt)
    print(f"OK {path} ({len(repls)} rules)")

# ── dashboard.js：安全态势页头 ──
apply('src/modules/dashboard.js', [
    ("<header class=\"wb-heading\"><div><h1>安全态势</h1></div><div>${button('恢复初始数据','App.resetDemo()','wb-reset')}</div></header>",
     "<div class=\"page-heading\"><div><h1>安全态势</h1></div><div class=\"page-actions\">${button('恢复初始数据','App.resetDemo()','wb-reset')}</div></div>", 1),
])

# ── exercise.js：安全态势页头 + 任务详情头（3 处）──
apply('src/modules/exercise.js', [
    ("<header class=\"wb-heading\"><div><h1>安全态势</h1></div><button class=\"wb-reset\" onclick=\"App.resetDemo()\">恢复初始数据</button></header>",
     "<div class=\"page-heading\"><div><h1>安全态势</h1></div><div class=\"page-actions\"><button class=\"wb-reset\" onclick=\"App.resetDemo()\">恢复初始数据</button></div></div>", 1),
    ("<div class=\"attack-detail-top\">", "<div class=\"page-heading\">", 2),
    ("<div class=\"attack-detail-top refined\">", "<div class=\"page-heading\">", 1),
    ("<div class=\"page-actions\" style=\"margin-left:auto\">", "<div class=\"page-actions\">", 2),
    ("<p>${t.id} · ${E(X.targetFor(t).name)} · 创建于 ${t.created}</p>",
     "<p class=\"page-desc\">${t.id} · ${E(X.targetFor(t).name)} · 创建于 ${t.created}</p>", 2),
    ("<p>任务创建时间：${E(t.created||'未记录')}</p>",
     "<p class=\"page-desc\">任务创建时间：${E(t.created||'未记录')}</p>", 1),
])

# ── evaluation.js：评估详情头 ──
apply('src/modules/evaluation.js', [
    ("<div class=\"attack-detail-top refined ec-detail-head\">", "<div class=\"page-heading ec-detail-head\">", 1),
    ("<p>任务创建时间：${E(t.created||'未记录')}${t.parentId?' · 复测来源：'+E(X.taskNumber(t.parentId)):''}</p>",
     "<p class=\"page-desc\">任务创建时间：${E(t.created||'未记录')}${t.parentId?' · 复测来源：'+E(X.taskNumber(t.parentId)):''}</p>", 1),
])

# ── protection.js：防护报告头 ──
apply('src/modules/protection.js', [
    ("<div class=\"attack-detail-top refined prr-report-heading\">", "<div class=\"page-heading prr-report-heading\">", 1),
    ("<p>报告编号：${E(report.id)}　生成时间：${S.time(report.generatedAt)}</p>",
     "<p class=\"page-desc\">报告编号：${E(report.id)}　生成时间：${S.time(report.generatedAt)}</p>", 1),
])

print("ALL DONE")
