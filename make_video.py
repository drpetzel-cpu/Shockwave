"""Render shockwave therapy social media video (1080x1920 vertical MP4)."""
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from moviepy import VideoClip, concatenate_videoclips
import os, math

W, H = 1080, 1920
FPS = 30

import platform as _platform

def _find_font(bold):
    system = _platform.system()
    candidates = (
        [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
        if system == "Darwin"
        else [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans.ttf",
        ]
    )
    for p in candidates:
        if os.path.exists(p):
            return p
    return None

BG        = (10,  22,  40)
BG2       = (20,  42,  80)
BG3       = ( 7,  16,  32)
BG4       = (15,  42,  80)
BLUE      = (30, 144, 255)
TEAL      = ( 0, 212, 170)
ORANGE    = (255, 107,  53)
WHITE     = (255, 255, 255)
SLATE     = (168, 184, 216)
PURPLE    = (123, 104, 238)
GOLD      = (255, 179,  71)

def f(size, bold=True):
    path = _find_font(bold)
    if path:
        return ImageFont.truetype(path, size)
    return ImageFont.load_default(size=size)

def sm(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)

def fade(t, start, end):
    if end <= start: return 1.0
    return sm((t - start) / (end - start))

def blend(color, alpha, bg=BG):
    return tuple(int(bg[i] + (color[i] - bg[i]) * max(0, min(1, alpha))) for i in range(3))

def grad_bg(w=W, h=H, c1=BG, c2=BG2):
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for i in range(3):
        col = np.linspace(c1[i], c2[i], h, dtype=np.float32)
        arr[:, :, i] = col.reshape(-1, 1)
    return arr

def cx_text(draw, text, y, font, color, alpha=1.0, bg=BG):
    bb = draw.textbbox((0, 0), text, font=font)
    x = (W - (bb[2] - bb[0])) // 2
    draw.text((x, y), text, font=font, fill=blend(color, alpha, bg))
    return bb[3] - bb[1]

def wrap_text(draw, text, y, font, color, max_w, gap=8, alpha=1.0, bg=BG):
    words = text.split()
    lines, cur = [], []
    for w in words:
        test = " ".join(cur + [w])
        bb = draw.textbbox((0, 0), test, font=font)
        if cur and bb[2] - bb[0] > max_w:
            lines.append(" ".join(cur)); cur = [w]
        else:
            cur.append(w)
    if cur: lines.append(" ".join(cur))
    lh = draw.textbbox((0,0), "Ag", font=font)[3]
    for i, line in enumerate(lines):
        bb = draw.textbbox((0, 0), line, font=font)
        x = (W - (bb[2] - bb[0])) // 2
        draw.text((x, y + i * (lh + gap)), line, font=font, fill=blend(color, alpha, bg))
    return lh + gap

def pill(draw, text, cx, cy, color, fnt, alpha=1.0, bg=BG):
    bb = draw.textbbox((0, 0), text, font=fnt)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    px, py = 28, 12
    x1, y1 = cx - tw//2 - px, cy - th//2 - py
    x2, y2 = cx + tw//2 + px, cy + th//2 + py
    draw.rounded_rectangle([x1, y1, x2, y2], radius=(y2-y1)//2,
                            outline=blend(color, alpha, bg), width=2)
    draw.text((cx - tw//2, cy - th//2), text, font=fnt, fill=blend(color, alpha, bg))

BG1 = grad_bg(c1=BG, c2=BG2)

def title_frame(t):
    img = Image.fromarray(BG1.copy())
    draw = ImageDraw.Draw(img)
    for i, r in enumerate([260, 390, 520, 650]):
        draw.ellipse([W//2-r, H//2-r, W//2+r, H//2+r], outline=blend(BLUE, 0.04, BG), width=2)
    a1 = fade(t, 0, 0.6); a2 = fade(t, 0.5, 1.2); a3 = fade(t, 1.0, 1.8)
    a4 = fade(t, 1.4, 2.2); a5 = fade(t, 2.0, 2.8)
    cx_text(draw, "HEALTH & WELLNESS", 260, f(28), TEAL, a1)
    if a1 > 0:
        fy = 380
        fc = blend((196, 133, 90), a1)
        draw.ellipse([W//2-90, fy, W//2+90, fy+80], fill=fc)
        draw.ellipse([W//2+50, fy-40, W//2+160, fy+40], fill=fc)
        draw.ellipse([W//2+100, fy-30, W//2+175, fy+25], fill=fc)
        draw.ellipse([W//2+138, fy-18, W//2+200, fy+20], fill=fc)
        draw.arc([W//2-85, fy+40, W//2+200, fy+130], start=0, end=180, fill=blend(ORANGE, a1), width=7)
        for wi in range(3):
            draw.arc([W//2-110-wi*30, fy-20-wi*22, W//2-30-wi*30, fy+70-wi*22],
                     start=270, end=90, fill=blend(BLUE, a1*(0.9-wi*0.25)), width=5)
    cx_text(draw, "Shockwave", 540, f(108, True), WHITE, a2)
    cx_text(draw, "Therapy",   662, f(108, True), BLUE,  a2)
    if a3 > 0:
        wrap_text(draw, "The breakthrough solution for Plantar Fasciitis", 820, f(52, False), SLATE, W-140, alpha=a3)
    if a4 > 0:
        dw = int(240*a4)
        draw.rounded_rectangle([W//2-dw//2, 950, W//2, 955], radius=2, fill=blend(BLUE, a4))
        draw.rounded_rectangle([W//2, 950, W//2+dw//2, 955], radius=2, fill=blend(TEAL, a4))
    if a5 > 0:
        wrap_text(draw, "#ShockwaveTherapy  #PlantarFasciitis  #HeelPain  #FootHealth",
                  1020, f(34, False), SLATE, W-120, alpha=a5*0.7)
    return np.array(img)

title_clip = VideoClip(title_frame, duration=5).with_fps(FPS)

BG_P = grad_bg(c1=BG, c2=(18, 38, 72))
PROB_CARDS = [
    ("1 in 10 adults",     "will develop plantar fasciitis",              ORANGE),
    ("Stabbing heel pain", "worst with your very first steps each morning",(255,87,34)),
    ("Common in runners",  "and those who stand for long hours",           GOLD),
    ("Slow to heal",       "without proper targeted treatment",            (255,140,60)),
]

def problem_frame(t):
    img = Image.fromarray(BG_P.copy())
    draw = ImageDraw.Draw(img)
    a_tag=fade(t,0,.5); a_head=fade(t,.3,1.1); a_sub=fade(t,.8,1.6); a_div=fade(t,1.1,1.9)
    cx_text(draw, "THE PROBLEM", 160, f(28), ORANGE, a_tag)
    cx_text(draw, "Understanding",     250, f(80,True), WHITE,  a_head)
    cx_text(draw, "Plantar Fasciitis", 348, f(80,True), ORANGE, a_head)
    wrap_text(draw, "Inflammation of the band of tissue connecting heel to toes", 480, f(44,False), SLATE, W-140, alpha=a_sub)
    if a_div > 0:
        dw=int(180*a_div)
        draw.rounded_rectangle([W//2-dw//2,582,W//2+dw//2,587], radius=2, fill=blend(ORANGE,a_div))
    card_y,card_h,card_gap = 640,228,18
    for i,(title,desc,color) in enumerate(PROB_CARDS):
        delay=1.8+i*1.7; a=fade(t,delay,delay+.55)
        if a<=0: continue
        slide=int((1-sm(min(1,(t-delay)/.55)))*110)
        cy=card_y+i*(card_h+card_gap)
        draw.rounded_rectangle([60+slide,cy,W-60+slide,cy+card_h], radius=18, fill=blend((18,36,65),a), outline=blend(color,a*.3), width=1)
        draw.rounded_rectangle([60+slide,cy,72+slide,cy+card_h], radius=9, fill=blend(color,a))
        nb=draw.textbbox((0,0),str(i+1),font=f(44,True)); nw=nb[2]-nb[0]
        draw.text((60+slide+42-nw//2,cy+30), str(i+1), font=f(44,True), fill=blend(color,a))
        draw.text((148+slide,cy+26), title, font=f(46,True),  fill=blend(WHITE,a))
        draw.text((148+slide,cy+90), desc,  font=f(36,False), fill=blend(SLATE,a))
    return np.array(img)

prob_clip = VideoClip(problem_frame, duration=12).with_fps(FPS)

BG_S = grad_bg(c1=BG, c2=(10,32,68))
SOL_STEPS = [
    ("Acoustic waves reach the heel",   "Calibrated energy pulses target the inflamed plantar fascia directly"),
    ("Stimulates the body's healing",    "Triggers blood flow, collagen production & growth factors"),
    ("Breaks down calcium deposits",     "Dissolves scar tissue driving chronic pain so the body can clear it"),
]

def solution_frame(t):
    img = Image.fromarray(BG_S.copy())
    draw = ImageDraw.Draw(img)
    a_tag=fade(t,0,.5); a_head=fade(t,.3,1.1); a_anim=fade(t,.8,1.6)
    cx_text(draw, "THE SOLUTION",         160, f(28),    BLUE,  a_tag)
    cx_text(draw, "Extracorporeal",       250, f(76,True),WHITE, a_head)
    cx_text(draw, "Shock Wave Therapy",   340, f(76,True),BLUE,  a_head)
    cx_text(draw, "(ESWT)",               432, f(60,True),WHITE, a_head)
    if a_anim > 0:
        pill(draw,"Non-Invasive",W//2-155,555,TEAL,  f(30,True),a_anim)
        pill(draw,"FDA-Cleared", W//2+130,555,BLUE,  f(30,True),a_anim)
        pill(draw,"No Surgery",  W//2-155,620,PURPLE,f(30,True),a_anim)
        pill(draw,"Proven",      W//2+130,620,GOLD,  f(30,True),a_anim)
        py0=740; wt=(t%0.85)/0.85
        draw.rounded_rectangle([W//2-22,py0-100,W//2+22,py0+50], radius=10, fill=blend((40,100,170),a_anim))
        draw.rounded_rectangle([W//2-28,py0+45,W//2+28,py0+72],  radius=8,  fill=blend((30,76,140),a_anim))
        draw.rounded_rectangle([W//2-14,py0+70,W//2+14,py0+82],  radius=4,  fill=blend(BLUE,a_anim))
        for wi in range(3):
            p=(wt+wi/3)%1.0; wr=int(p*160); wo=(1-p)*0.85*a_anim
            if wr>2: draw.arc([W//2-wr,py0+80,W//2+wr,py0+80+wr*2],start=15,end=165,fill=blend(BLUE,wo,BG),width=4)
        fy=py0+340; fc=blend((180,110,70),a_anim)
        draw.ellipse([W//2-110,fy,W//2+110,fy+70],fill=fc)
        draw.ellipse([W//2+65,fy-40,W//2+180,fy+36],fill=fc)
        draw.ellipse([W//2+120,fy-28,W//2+200,fy+22],fill=fc)
        draw.ellipse([W//2+160,fy-14,W//2+225,fy+18],fill=fc)
        draw.arc([W//2-100,fy+30,W//2+220,fy+120],start=0,end=180,fill=blend(ORANGE,a_anim),width=7)
    steps_y,step_h=1180,220
    for i,(title,desc) in enumerate(SOL_STEPS):
        delay=2.2+i*2.0; a=fade(t,delay,delay+.55)
        if a<=0: continue
        sy=steps_y+i*step_h; cr=42; cx2,cy2=100,sy+cr
        draw.ellipse([cx2-cr,cy2-cr,cx2+cr,cy2+cr],fill=blend(BLUE,a))
        nb=draw.textbbox((0,0),str(i+1),font=f(40,True))
        draw.text((cx2-(nb[2]-nb[0])//2,cy2-24),str(i+1),font=f(40,True),fill=blend(WHITE,a))
        if i<len(SOL_STEPS)-1:
            draw.line([cx2,cy2+cr,cx2,cy2+cr+(step_h-cr*2-10)],fill=blend(BLUE,a*.35),width=2)
        draw.text((165,sy+10),title,font=f(46,True),fill=blend(WHITE,a))
        wrap_text(draw,desc,sy+72,f(36,False),SLATE,W-200,alpha=a)
    return np.array(img)

sol_clip = VideoClip(solution_frame, duration=10).with_fps(FPS)

BG_B = grad_bg(c1=BG, c2=BG2)
CARDS = [("85%+","Success Rate",TEAL),("3-5","Sessions Only",BLUE),("Fast","Return to Activity",PURPLE),("Root","Cause Treatment",GOLD)]
CARD_DESCS = ["Patients see significant or complete relief after ESWT","Short 15-20 min in-office visits, 1-2 weeks apart","No lengthy recovery or immobilization needed","Triggers genuine tissue repair, not just pain relief"]

def benefits_frame(t):
    img = Image.fromarray(BG_B.copy())
    draw = ImageDraw.Draw(img)
    a_tag=fade(t,0,.5); a_head=fade(t,.3,1.1)
    cx_text(draw,"WHY CHOOSE ESWT",160,f(28),TEAL,a_tag)
    cx_text(draw,"Proven Benefits of",250,f(80,True),WHITE,a_head)
    cx_text(draw,"Shockwave Therapy",348,f(80,True),BLUE,a_head)
    cw,ch,gx,gy,grid_y=480,420,30,18,490
    for i,((stat,label,color),desc) in enumerate(zip(CARDS,CARD_DESCS)):
        delay=0.9+i*1.2; a=fade(t,delay,delay+.55); s=sm(min(1,(t-delay)/.55)) if t>delay else 0
        if a<=0: continue
        col=i%2; row=i//2
        x1=gx+col*(cw+gx); y1=grid_y+row*(ch+gy)
        scale=0.8+0.2*s; sw2=int(cw*scale); sh2=int(ch*scale)
        cx2=x1+cw//2; cy2=y1+ch//2
        bx1=cx2-sw2//2; by1=cy2-sh2//2; bx2=cx2+sw2//2; by2=cy2+sh2//2
        draw.rounded_rectangle([bx1,by1,bx2,by2],radius=18,fill=blend((15,34,62),a),outline=blend(color,a*.3),width=1)
        draw.rounded_rectangle([bx1,by1,bx2,by1+6],radius=9,fill=blend(color,a))
        sb=draw.textbbox((0,0),stat,font=f(90,True)); sw3=sb[2]-sb[0]
        draw.text((cx2-sw3//2,by1+24),stat,font=f(90,True),fill=blend(color,a))
        lb=draw.textbbox((0,0),label,font=f(40,True)); lw=lb[2]-lb[0]
        draw.text((cx2-lw//2,by1+138),label,font=f(40,True),fill=blend(WHITE,a))
        wrap_text(draw,desc,by1+200,f(30,False),SLATE,sw2-40,alpha=a)
    return np.array(img)

ben_clip = VideoClip(benefits_frame, duration=9).with_fps(FPS)

BG_C = grad_bg(c1=BG3, c2=BG4)

def cta_frame(t):
    img = Image.fromarray(BG_C.copy())
    draw = ImageDraw.Draw(img)
    for i,r0 in enumerate([210,350,490]):
        r=r0+math.sin(t*1.1+i)*28
        draw.ellipse([W//2-r,H//2-r,W//2+r,H//2+r],outline=blend(BLUE,0.05,BG3),width=2)
    a1=fade(t,.2,1.1); a2=fade(t,.8,1.8); a3=fade(t,1.3,2.2); a4=fade(t,2.0,3.0); a5=fade(t,3.2,4.2)
    cx_text(draw,"Ready to Walk",H//2-340,f(96,True),WHITE,a1,BG3)
    cx_text(draw,"Pain-Free?",   H//2-224,f(96,True),TEAL, a1,BG3)
    wrap_text(draw,"Ask your healthcare provider about Extracorporeal Shock Wave Therapy for plantar fasciitis",
              H//2-80,f(44,False),SLATE,W-140,alpha=a2,bg=BG3)
    if a3>0:
        dw=int(320*a3)
        draw.rounded_rectangle([W//2-dw//2,H//2+140,W//2,       H//2+144],radius=2,fill=blend(BLUE,a3,BG3))
        draw.rounded_rectangle([W//2,       H//2+140,W//2+dw//2,H//2+144],radius=2,fill=blend(TEAL,a3,BG3))
    if a4>0:
        bw=int(700*sm(min(1,(t-2.0)))); bx=W//2-bw//2; bh=100; by=H//2+190
        draw.rounded_rectangle([bx-12,by-12,bx+bw+12,by+bh+12],radius=58,fill=blend(BLUE,a4*0.18,BG3))
        draw.rounded_rectangle([bx,by,bx+bw,by+bh],radius=48,fill=blend(BLUE,a4,BG3))
        btn="Talk to Your Doctor Today"; bb=draw.textbbox((0,0),btn,font=f(46,True)); bw2=bb[2]-bb[0]
        draw.text((W//2-bw2//2,by+26),btn,font=f(46,True),fill=blend(WHITE,a4,BLUE))
    if a5>0:
        facts=["+  Non-Invasive","+  FDA-Cleared","+  No Surgery","+  Proven"]
        fw_list=[draw.textbbox((0,0),fa,font=f(34,True))[2] for fa in facts]
        gap=44; total=sum(fw_list)+gap*(len(facts)-1); x=(W-total)//2; fy2=H//2+370
        for fa,fw in zip(facts,fw_list):
            draw.text((x,fy2),fa,font=f(34,True),fill=blend(TEAL,a5,BG3)); x+=fw+gap
    return np.array(img)

cta_clip = VideoClip(cta_frame, duration=8).with_fps(FPS)

print("Assembling clips...")
final = concatenate_videoclips([title_clip, prob_clip, sol_clip, ben_clip, cta_clip])
os.makedirs("out", exist_ok=True)
out = "out/shockwave-therapy.mp4"
print(f"Rendering {final.duration:.0f}s video to {out} ...")
final.write_videofile(out, fps=FPS, codec="libx264", audio=False, threads=4, logger="bar")
print(f"\nDone! Video saved to {out}")
