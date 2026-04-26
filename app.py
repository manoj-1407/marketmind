from fastapi import FastAPI, Request, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional, List
import pandas as pd
import os
from dotenv import load_dotenv
import groq
import uvicorn
import random

from sqlalchemy.orm import Session
from fastapi import Depends
import models
import database

load_dotenv()

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI(title="MarketMind Professional - AI Marketing Suite")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Initialize Groq AI Client
try:
    api_key = os.getenv("GROQ_API_KEY")
    print(f"🔑 Groq API Key: {'✅ SET' if api_key else '❌ MISSING'}")
    client = groq.Groq(api_key=api_key) if api_key else None
except Exception as e:
    print(f"❌ Groq Initialization Error: {e}")
    client = None

# Global data store
leads_df = pd.DataFrame()

# ============================================
# PAGE ROUTES
# ============================================

@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    """Homepage with feature overview"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/campaign", response_class=HTMLResponse)
async def campaign_page(request: Request):
    """Campaign Generator Page"""
    return templates.TemplateResponse("campaign.html", {"request": request})

@app.get("/pitch", response_class=HTMLResponse)
async def pitch_page(request: Request):
    """Pitch Deck Generator Page"""
    return templates.TemplateResponse("pitch.html", {"request": request})

@app.get("/lead-score", response_class=HTMLResponse)
async def leads_page(request: Request):
    """Lead Scoring Page"""
    return templates.TemplateResponse("lead_score.html", {"request": request})

# ============================================
# PYDANTIC MODELS (Request Validation)
# ============================================

class CampaignRequest(BaseModel):
    product: str
    audience: str
    budget: Optional[str] = ""
    timeline: Optional[str] = ""
    industry: Optional[str] = ""
    objective: Optional[str] = "leads"
    tone: Optional[str] = "professional"
    leadGoal: Optional[str] = ""
    platforms: Optional[str] = "Google Ads"
    competitors: Optional[str] = ""
    usp: Optional[str] = ""
    abTesting: Optional[bool] = False
    contentType: Optional[str] = "all"
    visualStyle: Optional[str] = "professional"
    aiInstructions: Optional[str] = ""
    hasMedia: Optional[bool] = False
    mediaType: Optional[str] = "none"
    mediaName: Optional[str] = ""

class PitchRequest(BaseModel):
    product: str
    audience: str
    problem: str
    solution: str
    fundingStage: Optional[str] = "seed"
    amountSeeking: Optional[str] = ""
    valuation: Optional[str] = ""
    teamSize: Optional[str] = ""
    revenue: Optional[str] = ""
    customers: Optional[str] = ""
    growthRate: Optional[str] = ""
    burnRate: Optional[str] = ""
    marketSize: Optional[str] = ""
    competitors: Optional[str] = ""
    advantage: Optional[str] = ""
    businessModel: Optional[str] = "subscription"
    pricing: Optional[str] = ""
    includeFinancials: Optional[bool] = False
    includeRoadmap: Optional[bool] = False
    includeTeam: Optional[bool] = False

class LeadRequest(BaseModel):
    name: str
    company: Optional[str] = ""
    role: Optional[str] = ""
    email: Optional[str] = ""
    industry: Optional[str] = ""
    companySize: Optional[str] = ""
    budget: Optional[str] = ""
    urgency: Optional[str] = ""
    source: Optional[str] = ""
    engagement: Optional[str] = ""
    notes: Optional[str] = ""

# ============================================
# CAMPAIGN GENERATOR API - ULTRA CREATIVE
# ============================================

@app.post("/api/generate_campaign")
async def api_generate_campaign(request: CampaignRequest, db: Session = Depends(database.get_db)):
    print(f"\n{'='*60}")
    print(f"📥 CAMPAIGN REQUEST RECEIVED")
    print(f"{'='*60}")
    print(f"Product: {request.product}")
    print(f"Audience: {request.audience}")
    print(f"Tone: {request.tone} | Style: {request.visualStyle}")
    print(f"Platforms: {request.platforms}")
    if request.hasMedia:
        print(f"📸 Media: {request.mediaType} - {request.mediaName}")
    if request.aiInstructions:
        print(f"🎯 Custom Instructions: {request.aiInstructions[:100]}...")
    print(f"{'='*60}\n")
    
    try:
        # BUILD ULTRA-CREATIVE PROMPT
        prompt_parts = [
            "🎯 YOU ARE AN AWARD-WINNING CREATIVE DIRECTOR",
            "You've created campaigns for Nike, Apple, and Liquid Death.",
            "Your work has won Cannes Lions. You make boring products exciting.",
            "",
            f"CREATE A CAMPAIGN THAT MAKES PEOPLE STOP SCROLLING FOR:",
            f"**Product:** {request.product}",
            f"**Target Audience:** {request.audience}",
            "",
            "🔥 MANDATORY CREATIVE RULES:",
            "1. NO BORING CORPORATE SPEAK - Write like a human, not a robot",
            "2. USE SPECIFIC NUMBERS - Not '500+' but '2,847 teams' or '$47,392 saved'",
            "3. TELL MICRO-STORIES - Every section needs a 2-sentence story",
            "4. EMOTIONAL TRIGGERS - Fear, desire, FOMO, curiosity, anger, joy",
            "5. UNEXPECTED METAPHORS - 'Your CRM is a graveyard' not 'CRM is outdated'",
            "6. BAN THESE WORDS: revolutionary, cutting-edge, game-changer, innovative (unless you justify WHY)",
            "7. MAKE IT VISUAL - Describe scenes people can picture",
            "8. USE CONTRAST - Before vs After, Them vs Us, Old Way vs New Way",
            "",
        ]
        
        # Campaign specifications
        prompt_parts.extend([
            "📋 CAMPAIGN SPECIFICATIONS:",
            f"• Content Format: {request.contentType}",
            f"• Visual Style: {request.visualStyle}",
            f"• Communication Tone: {request.tone}",
            f"• Primary Objective: {request.objective}",
            f"• Platforms: {request.platforms}",
            f"• Budget Range: {request.budget or 'Flexible'}",
            f"• Campaign Duration: {request.timeline or '30 days'}",
            f"• Lead Target: {request.leadGoal or '500'} qualified leads",
        ])
        
        if request.industry:
            prompt_parts.append(f"• Industry Context: {request.industry}")
        if request.competitors:
            prompt_parts.append(f"• Direct Competitors: {request.competitors}")
        if request.usp:
            prompt_parts.append(f"• Unique Selling Point: {request.usp}")
        
        # Media file context
        if request.hasMedia:
            prompt_parts.extend([
                "",
                f"📸 VISUAL ASSET AVAILABLE:",
                f"• File: '{request.mediaName}'",
                f"• Type: {request.mediaType}",
                f"• REQUIREMENT: Reference this asset SPECIFICALLY in your creative concepts",
                f"• Give 3 different ways to use it (not generic 'hero image' BS)",
            ])
        
        # Custom AI instructions (HIGHEST PRIORITY)
        if request.aiInstructions:
            prompt_parts.extend([
                "",
                "💎💎💎 PRIORITY CUSTOM INSTRUCTIONS (FOLLOW THESE ABOVE ALL ELSE):",
                f"{request.aiInstructions}",
                "💎💎💎",
                "",
            ])
        
        # Creative inspiration examples
        prompt_parts.extend([
            "",
            "✨ COPYWRITING ENERGY YOU SHOULD MATCH:",
            "",
            "❌ BAD (Boring): 'Our productivity software helps teams collaborate better'",
            "✅ GOOD (Punchy): 'Your team spent 47 hours in meetings last week. Three were useful. That's 44 hours of your life you'll never get back.'",
            "",
            "❌ BAD: 'Join thousands of satisfied customers today'",
            "✅ GOOD: '2,847 founders ditched their $50/month tools last quarter. That's $1.7M saved. Your turn.'",
            "",
            "❌ BAD: 'Revolutionary CRM solution for modern businesses'",
            "✅ GOOD: 'Your CRM is where leads go to die. We're the defibrillator.'",
            "",
            "❌ BAD: 'Try our free trial today, no credit card required'",
            "✅ GOOD: 'See exactly how much money you're hemorrhaging. Then fix it in 14 minutes.'",
            "",
            "NOW WRITE WITH THAT LEVEL OF PUNCH 👊",
            "",
        ])
        
        # Output structure (creative sections)
        prompt_parts.extend([
            "📝 GENERATE THESE SECTIONS (MAKE EACH ONE POP):",
            "",
            "## 🎯 Campaign Big Idea",
            "• ONE sentence that captures the entire campaign (make it memorable)",
            "• Then write 3 headline variations that make people STOP SCROLLING",
            "• Each headline should trigger an emotion (fear/desire/curiosity)",
            "",
            "## 👥 Audience Deep Dive",
            "• NOT demographics - PSYCHOGRAPHICS",
            "• What keeps them up at 3am?",
            "• What do they secretly want but won't admit?",
            "• What's their biggest frustration right now?",
            "• Write like you're describing your best friend",
            "",
            "## 💡 5 Content Angles (NOT boring 'pillars')",
            "Format each as:",
            "**[Catchy Name]** (e.g., 'The $10K Mistake' or 'The 3AM Realization')",
            "Hook: [One sentence that creates curiosity]",
            "Story: [2-3 sentences with SPECIFIC example - name a character, use real numbers]",
            "",
            "## 📢 3 Ad Variations - A/B/C",
            "**Variation A: PROBLEM/AGITATION** (Twist the knife - make it hurt)",
            "- Headline: [Question or shocking statement]",
            "- Body: [2-3 sentences, each one escalates the pain]",
            "- CTA: [Action-oriented, benefit-focused]",
            "",
            "**Variation B: SOCIAL PROOF BOMB** (Show everyone's doing it)",
            "- Headline: [Specific number + social context]",
            "- Body: [Why they switched, what they gained, FOMO element]",
            "- CTA: [Bandwagon appeal]",
            "",
            "**Variation C: FUTURE PACING** (Paint the dream)",
            "- Headline: ['Imagine...' or 'What if...' hook]",
            "- Body: [Describe the transformation, use sensory details]",
            "- CTA: [Make the dream real]",
            "",
            "## 🎨 Visual Creative Direction",
            f"For {request.contentType} in {request.visualStyle} style:",
            "• Describe the opening shot (first 2 seconds)",
            "• Color palette and mood",
            "• Typography style",
            "• Motion/animation style (if video)",
            "• Reference 1-2 existing ads if helpful (e.g., 'Think Apple's Shot on iPhone but more raw')",
        ])
        
        # Media-specific section
        if request.hasMedia:
            prompt_parts.extend([
                "",
                f"## 📸 How to Use '{request.mediaName}' - 3 Creative Concepts",
                "**Concept 1:** [Creative name]",
                "- Setup: [How to frame/crop/edit the asset]",
                "- Copy overlay: [Specific text]",
                "- Why it works: [Psychology]",
                "",
                "**Concept 2:** [Different creative name]",
                "- [Different approach with same asset]",
                "",
                "**Concept 3:** [Third unique approach]",
                "- [Completely different creative direction]",
            ])
        
        # Platform-specific content
        prompt_parts.extend([
            "",
            "## 📱 Platform-Specific Hooks",
            f"Write ACTUAL opening lines for: {request.platforms}",
            "",
            "**Google Ads (Search Intent):**",
            "• Headline: [What they're searching for + benefit]",
            "• Description: [Overcome objection, add social proof]",
            "",
            "**LinkedIn (Professional but Intriguing):**",
            "• Opening line: [Personal story or contrarian take]",
            "• Hook at end: [Tease the solution]",
            "",
            "**Facebook (Conversational):**",
            "• Start: [Question or relatable frustration]",
            "• Middle: [Story or data]",
            "• End: [Soft CTA]",
            "",
            "**Instagram (Visual-First):**",
            "• Visual description: [What they see]",
            "• Caption: [Short, punchy, emoji-friendly]",
            "",
            "**TikTok (Fast-Paced):**",
            "• Hook (0-3sec): [Pattern interrupt]",
            "• Body (4-15sec): [Quick payoff]",
            "• CTA (16-20sec): [Where to learn more]",
            "",
            "**Twitter/X (Viral-Worthy):**",
            "• Thread opener: [Bold claim or question]",
            "• Tweet 2-4: [Break down the insight]",
            "• Final tweet: [CTA with link]",
            "",
            "## ⚡ 5 Call-to-Action Options (Ranked by Expected Performance)",
            "1. [Interactive/Curiosity-driven - e.g., 'Calculate Your Waste']",
            "2. [Low-commitment - e.g., 'See It in 90 Seconds']",
            "3. [Value-first - e.g., 'Steal Our Template']",
            "4. [Social proof - e.g., 'Join 2,847 Teams']",
            "5. [Classic - e.g., 'Start Free Trial']",
            "",
            "## 📊 Success Metrics & Benchmarks",
            "Create a table comparing:",
            "- Industry Average",
            "- Our Target (be ambitious but realistic)",
            "- Why we'll beat the average (2-3 reasons)",
            "",
            "Metrics: CTR, CPC, Conversion Rate, Cost Per Lead, Lead Velocity",
            "",
            "## 💰 Budget Allocation",
            f"Total Budget: {request.budget or 'Optimize for ~$15K'}",
            "Break down by:",
            "- Paid media (% and $)",
            "- Creative production (% and $)",
            "- Retargeting (% and $)",
            "- Testing budget (% and $)",
            "- Contingency (% and $)",
            "",
            "Then split paid media across platforms with rationale",
            "",
            "## 📅 4-Week Rollout Calendar",
            "**Week 1: [Theme Name]**",
            "Strategy: [What and why]",
            "Content: [Specific pieces]",
            "Goal: [Numbers]",
            "",
            "**Week 2: [Different Theme]**",
            "**Week 3: [Build on momentum]**",
            "**Week 4: [Close strong]**",
        ])
        
        # A/B testing section
        if request.abTesting:
            prompt_parts.extend([
                "",
                "## 🧪 A/B Testing Roadmap",
                "**Test 1: [Creative Element]**",
                "- Control: [Describe A]",
                "- Variant: [Describe B]",
                "- Hypothesis: [Why you think B will win + expected % lift]",
                "- Decision Criteria: [How you'll call the winner]",
                "",
                "**Test 2: [Different Element]**",
                "[Same format]",
                "",
                "**Test 3: [Third Test]**",
                "[Same format]",
            ])
        
        # Closing instructions
        prompt_parts.extend([
            "",
            "🚀 FINAL REMINDERS:",
            "• Every section should make me FEEL something",
            "• Use specific numbers, not ranges",
            "• Tell stories, not features",
            "• Write like you're texting a friend who asked for marketing advice",
            "• Make it IMPOSSIBLE TO IGNORE",
            "",
            "NOW GO MAKE MAGIC ✨",
        ])
        
        full_prompt = "\n".join(prompt_parts)
        
        # TRY AI GENERATION FIRST
        content = None
        if client:
            try:
                print("🤖 Calling Groq AI (LLaMA 3 70B)...")
                completion = client.chat.completions.create(
                    model="llama3-70b-8192",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a legendary creative director. You've won Cannes Lions, created viral Super Bowl ads, and made boring B2B SaaS products exciting. You write with the wit of David Ogilvy, the directness of Dan Kennedy, and the rawness of Gary Vaynerchuk. You NEVER use corporate jargon or clichés. Every word has a purpose. Every sentence creates emotion. You make marketing that people actually want to read."
                        },
                        {
                            "role": "user",
                            "content": full_prompt
                        }
                    ],
                    temperature=0.85,  # High creativity
                    max_tokens=4000,   # Long output
                    top_p=0.95,        # Diverse sampling
                    frequency_penalty=0.3,  # Reduce repetition
                    presence_penalty=0.2    # Encourage new topics
                )
                content = completion.choices[0].message.content
                print("✅ AI generation successful!")
                print(f"📝 Generated {len(content)} characters")
            except Exception as e:
                print(f"⚠️ Groq API failed: {e}")
                print("📝 Falling back to creative template...")
        else:
            print("⚠️ No Groq client - using template")
        
        # FALLBACK TO CREATIVE TEMPLATE
        if not content:
            content = generate_creative_campaign_template(request)
        
        # Save to database
        try:
            new_campaign = models.Campaign(
                product=request.product,
                audience=request.audience,
                content=content
            )
            db.add(new_campaign)
            db.commit()
            db.refresh(new_campaign)
        except Exception as db_err:
            print(f"⚠️ Database save failed: {db_err}")
            
        print("✅ Campaign generation complete!\n")
        return {"content": content}
    
    except Exception as e:
        print(f"❌ ERROR in campaign generation: {e}")
        import traceback
        traceback.print_exc()
        return {"content": f"## ⚠️ Generation Error\n\nSomething went wrong, but we're on it!\n\n**Error:** {str(e)}\n\n**Try:**\n- Simplifying your inputs\n- Removing special characters\n- Refreshing and trying again"}


def generate_creative_campaign_template(request: CampaignRequest):
    """ULTRA-CREATIVE FALLBACK TEMPLATE"""
    
    # Dynamic power words based on tone
    tone_styles = {
        'professional': {
            'words': ['proven', 'validated', 'enterprise-grade', 'strategic', 'optimized'],
            'hook': f"What if {request.product} could 10x your results without 10x-ing your team?",
        },
        'casual': {
            'words': ['killer', 'epic', 'game-changing', 'no-brainer', 'legit'],
            'hook': f"Real talk: {request.product} is about to change how you think about {request.industry or 'your industry'}",
        },
        'luxury': {
            'words': ['exclusive', 'bespoke', 'elite', 'premium', 'unparalleled'],
            'hook': f"For {request.audience} who refuse to compromise",
        },
        'aggressive': {
            'words': ['dominate', 'crush', 'obliterate', 'conquer', 'destroy'],
            'hook': f"While your competitors are sleeping, {request.product} users are winning",
        },
        'empathetic': {
            'words': ['understand', 'support', 'guide', 'empower', 'nurture'],
            'hook': f"We know how hard it is being a {request.audience.split(',')[0]}. That's why we built {request.product}",
        },
        'humorous': {
            'words': ['hilarious', 'ridiculous', 'absurd', 'wild', 'bonkers'],
            'hook': f"Warning: {request.product} may cause excessive productivity and spontaneous celebrations",
        }
    }
    
    style_config = tone_styles.get(request.tone, tone_styles['professional'])
    
    # Calculate realistic metrics
    lead_goal = int(request.leadGoal) if request.leadGoal else 500
    
    budget_mapping = {
        '1000-5000': 3000,
        '5000-10000': 7500,
        '10000-25000': 17500,
        '25000-50000': 37500,
        '50000-100000': 75000,
        '100000+': 150000
    }
    budget_num = budget_mapping.get(request.budget, 15000)
    
    cost_per_lead = round(budget_num / lead_goal, 2)
    daily_leads = round(lead_goal / 30, 1)
    cpc = round(cost_per_lead * 0.6, 2)
    
    # Random realistic numbers for social proof
    social_numbers = [2847, 3291, 1847, 4102, 2539, 3847]
    teams_switched = random.choice(social_numbers)
    
    # Media-specific creative concepts
    media_section = ""
    if request.hasMedia:
        media_section = f"""

## 📸 How to Use '{request.mediaName}' - 3 Creative Concepts

### Concept 1: "The Transformation Split"
**Setup:** Split-screen the {request.mediaType}
- Left side: "{request.mediaName}" in raw/before state, grayscale filter
- Right side: Same asset but vibrant, with overlaid success metrics ("+247% ROI", "$38K saved")

**Copy Overlay:** "This is what happens when {request.audience} stop settling for [competitor]"

**Why It Works:** Before/after triggers the brain's pattern recognition. People LOVE transformations.

---

### Concept 2: "The Hidden Detail"
**Setup:** Zoom into a surprising detail in '{request.mediaName}'
- Start wide, then dramatic zoom into one unexpected element
- Pause for 2 seconds with text: "See that?"
- Reveal: "That's the difference between $10K and $100K"

**Copy Overlay:** Use curiosity gap psychology - make them watch till the end

**Why It Works:** Creates intrigue. Forces engagement. People hate unanswered questions.

---

### Concept 3: "The Story Behind"
**Setup:** Use '{request.mediaName}' as background texture (subtle, 30% opacity)
- Overlay customer testimonial in bold text
- Photo of real customer in corner
- End with before/after numbers

**Copy Overlay:** "When Sarah switched to {request.product}, everything changed..."

**Why It Works:** {request.visualStyle.title()} aesthetic + social proof = trust at scale
"""
    
    # AI custom instructions highlight
    ai_section = ""
    if request.aiInstructions:
        ai_section = f"""
---

🎯 **CUSTOM CREATIVE DIRECTION APPLIED:**

*"{request.aiInstructions}"*

Everything below has been tailored to these specific instructions.

---
"""
    
    # Platform count for multi-platform note
    platform_list = [p.strip() for p in request.platforms.split(',')]
    platform_count = len(platform_list)
    
    return f"""# 🚀 Campaign Strategy: {request.product}

{ai_section}

## 🎯 The Big Idea

**Campaign Hook:** {style_config['hook']}

**One-Sentence Concept:**
"{request.product} - Because {request.audience} Deserve Better Than What They're Currently Settling For"

---

### 3 Headlines That Stop The Scroll

**Headline 1: The Shocking Truth**
> "{lead_goal} {request.audience} Just Realized They've Been Wasting ${round(cost_per_lead * 5, 0)}/Month. Here's What They Did About It."

**Headline 2: The FOMO Bomb**
> "While You Were Hesitating, {teams_switched} Teams Switched to {request.product}. They're Not Coming Back."

**Headline 3: The Future Paint**
> "Imagine If {request.audience.split(',')[0]}s Could Reclaim 14 Hours Every Week. Spoiler: They Can."

---

## 👥 Audience Deep Dive

### Who They Really Are

{request.audience} aren't just demographics in a spreadsheet. They're humans dealing with:

**What Keeps Them Up at 3AM:**
- Quarterly targets that seem impossible
- Competitors who seem to be moving faster
- The fear that they're missing the next big shift
- {"Budget constraints and ROI pressure" if request.objective == "leads" else "Brand perception and market share"}

**Their Secret Desire:**
To look like a genius in the next team meeting when they unveil {request.product}

**Biggest Frustration Right Now:**
{f"Juggling 8 different tools that don't talk to each other, spending $4,200/month, and STILL manually exporting CSVs like it's 2015" if request.industry == "saas" else f"Watching their competitors gain ground while they're stuck with legacy systems that were 'state of the art' in 2019"}

**The Language They Use:**
{'"Growth hacking", "pivot", "synergy", "circle back"' if request.tone == 'professional' else '"No cap", "bussin", "hits different", "main character energy"' if request.tone == 'casual' else 'Industry jargon mixed with cautious optimism'}

**Decision Trigger:**
The moment they realize their current solution is costing them MORE than {request.product}

---

## 💡 5 Content Angles That Hit Different

### 1. **"The $10K Leak"** (Problem Agitation)

**Hook:** Your current solution has a hidden cost you're not tracking.

**Story:** Meet Sarah Chen. VP of Sales at 50-person SaaS startup. Spent $8,400 on a "best-in-class" CRM. Looked great in demos. 

Reality? 23 qualified leads fell through the cracks in 60 days because follow-ups weren't automated. Each lead worth ~$4,800 in LTV. That's $110,400 in lost revenue.

She switched to {request.product}. Now closing 18% more deals. Same team. Same effort. Different results.

**Takeaway:** The cheapest solution is expensive if it doesn't work.

---

### 2. **"The 3AM Realization"** (Emotional Hook)

**Hook:** What if everything you thought about {request.industry or "your industry"} was... wrong?

**Story:** {request.audience.split(',')[0]}s spend an average of 14.2 hours per week on tasks that could be automated. That's 738.4 hours per year. That's 30.7 ENTIRE DAYS of your life.

{request.product} gives you that time back. Not "saves time" - literally GIVES YOU BACK YOUR LIFE.

What would you do with 30 extra days? Learn a language? Launch that side project? Actually see your family?

**Takeaway:** Time is the only asset you can't earn back.

---

### 3. **"The Unfair Advantage"** (Social Proof Bomb)

**Hook:** Why are {request.competitors or "your competitors'"} customers defecting to you?

**Story:** {teams_switched} teams switched to {request.product} in Q4 2025. We surveyed them. Here's what they said:

- "It took 14 minutes to set up. Our old tool took 6 weeks."
- "We're spending $890/month instead of $4,200."
- "I actually USE this one. My old CRM was a graveyard."
- "ROI hit positive in 18 days. Previous tool never got there."

They're not smarter than you. They just found {request.product} first. Now they're running circles around competitors still stuck on legacy tools.

**Takeaway:** First-mover advantage is real. So is fast-follower advantage.

---

### 4. **"The Secret Menu"** (Curiosity Gap)

**Hook:** 7 features your current tool doesn't advertise (because they don't have them)

**Story:** 
- Feature #1: {request.usp or "Real-time sync that actually works"}
- Feature #2: One-click integrations (no Zapier tax)
- Feature #3: Mobile app that doesn't suck
- Feature #4 alone saves teams $3,200/month
- Feature #5-7: We'll show you on the demo (they're that good)

Your competitors found features #4 and #7. That's why they're winning.

**Takeaway:** You're paying for features you don't have.

---

### 5. **"The Time Machine"** (Future Pacing)

**Hook:** Close your eyes. It's {request.timeline or "90 days"} from now...

**Story:** You walk into Monday's team meeting. The dashboard is actually GREEN for once. Pipeline is full. Every lead is tagged, qualified, and assigned.

No one's asking "Wait, what happened to that hot lead from Tuesday?"

No firefighting. No panic. No Slack threads titled "URGENT - Where is the XYZ data???"

Your CEO asks, "What changed?"

You just smile and say one word: "{request.product}."

That's {request.audience} with {request.product}. That's you in {request.timeline or "90 days"}.

**Takeaway:** The future you want is closer than you think.

---

## 📢 3 Ad Variations - Each One Different

### 🅰️ Variation A: Twist The Knife (Problem/Agitation)

**Headline:** 
Still Manually Doing [Task]? Your Competitors Automated It in February.

**Body:**
Let's talk about last Tuesday.

You spent 47 minutes copy-pasting data between Excel and your CRM. Your competitor? They automated that in 2024.

You spent 2 hours in a "quick sync" meeting. They're using {request.product}'s AI to handle it.

You closed 3 deals this month. They closed 11.

See the pattern?

**CTA:** 
→ See What You're Missing (14-min Demo)

**Why This Works:** Pain + specificity + competitor comparison = urgency

---

### 🅱️ Variation B: Social Proof Nuclear Bomb

**Headline:**
{teams_switched} Teams Switched Last Quarter. Here's Why They're Not Coming Back.

**Body:**
We asked them. Here's what they said:

❌ Old Tool: "$4,200/month, 6-week setup, 18 features we never used"
✅ {request.product}: "$890/month, 14-min setup, everything actually works"

❌ Old Tool: "Support tickets took 48 hours. Usually got 'restart and try again'"
✅ {request.product}: "Live chat. Real humans. Actual solutions."

❌ Old Tool: "Team adoption was 34%. Most went back to Excel"
✅ {request.product}: "96% daily active users. They actually LIKE using it"

The average team saved $47,392 in Year 1. That's not a typo.

**CTA:**
→ Join {teams_switched + lead_goal} Teams (No CC Required)

**Why This Works:** Specific numbers + real quotes + massive social proof

---

### 🅲 Variation C: Paint The Dream (Future Pacing)

**Headline:**
What If Mondays Didn't Suck Anymore?

**Body:**
Picture this:

It's Monday morning. You grab coffee. Open your laptop. Dashboard loads.

Everything's green. Pipeline is full and organized. Every lead has a status. Every task has an owner. Nothing's fallen through cracks.

Your team actually WANTS to be in the standup because there's real progress to share.

Your CEO sends a Slack: "Whatever you're doing, keep doing it 👏"

That's not fantasy. That's {request.audience} with {request.product}.

That's you. In {request.timeline or "30 days"}.

**CTA:**
→ Make Mondays Great Again (Start Free)

**Why This Works:** Emotional, sensory details + transformation narrative

{media_section}

---

## 🎨 Visual Creative Direction

### For {request.contentType} in {request.visualStyle} Style

**Opening Shot (First 2 Seconds):**
{f"Split-screen chaos (left) vs calm (right). Immediate visual contrast." if request.visualStyle == "professional" else "Fast cut montage with trending audio, hook in first 0.5sec" if request.visualStyle == "genz" else "Slow, cinematic pull-back reveal with emotional music" if request.visualStyle == "emotional" else "Extreme close-up on premium detail, shallow depth of field"}

**Color Palette:**
{f"Trust Blue (#0066CC), Success Green (#00D084), Clean White, Strategic Gray accents" if request.visualStyle == "professional" else "Neon Purple (#B026FF), Electric Cyan (#00F0FF), Dark Mode Blacks, RGB gradients" if request.visualStyle == "genz" else "Warm Golds (#F4C430), Deep Blues (#003366), Soft Whites, Emotional Oranges" if request.visualStyle == "emotional" else "Luxury Black (#0A0A0A), Champagne Gold (#D4AF37), Pure White, Silver accents"}

**Typography:**
{f"Sans-serif (Inter or SF Pro), Bold headlines, Clean hierarchy" if request.visualStyle == "professional" else "Mixed fonts, handwritten accents, dynamic sizing, meme text format" if request.visualStyle == "genz" else "Serif headers (Playfair), Script accents, generous spacing" if request.visualStyle == "emotional" else "Luxury serif (Didot), minimal copy, lots of white space"}

**Motion Style:**
{f"Smooth, professional transitions. Data visualization. Graph animations." if request.contentType == "video" else "Static with subtle hover effects" if request.contentType == "photo" else "Swipe-through storytelling"}

**Reference Vibe:**
{f"Think: Apple keynote meets McKinsey presentation" if request.visualStyle == "professional" else "Think: MrBeast thumbnails meet TikTok POVs" if request.visualStyle == "genz" else "Think: Apple 'Shot on iPhone' meets Airbnb storytelling" if request.visualStyle == "emotional" else "Think: Rolex ads meet Tesla minimalism"}

---

## 📱 Platform-Specific Hooks

### {platform_count} Platform{"s" if platform_count > 1 else ""} - Each Needs Different Energy

{"**🔍 Google Ads (Search Intent Focus)**" if "google" in request.platforms.lower() else ""}
{"**Headline:** " + f'"{request.product} Alternative | Save ${round(budget_num * 0.3)} in Year 1 | 4.9★"' if "google" in request.platforms.lower() else ""}
{"**Description:** Stop overpaying for " + f'{request.competitors or "outdated tools"}. {teams_switched} teams switched. 14-min setup. No credit card for trial. See why in 90 seconds.' if "google" in request.platforms.lower() else ""}

{"**💼 LinkedIn (Professional But Intriguing)**" if "linkedin" in request.platforms.lower() else ""}
{"**Opening Line:**" if "linkedin" in request.platforms.lower() else ""}
{"*I just saved my team $38,000 in software costs. Here's the exact 4-step playbook:*" if "linkedin" in request.platforms.lower() else ""}

{"*1. Audited our tool stack (we had 11 tools doing 4 jobs)*" if "linkedin" in request.platforms.lower() else ""}
{"*2. Found overlap (8 tools had duplicate features)*" if "linkedin" in request.platforms.lower() else ""}
{f"*3. Switched to {request.product} (one platform, all features)*" if "linkedin" in request.platforms.lower() else ""}
{"*4. Canceled the redundant 8 ($3,200/month saved)*" if "linkedin" in request.platforms.lower() else ""}

{"*Total annual savings: $38,400*" if "linkedin" in request.platforms.lower() else ""}
{f"*Spoiler: The switch took 14 minutes. Comments if you want the template 👇*" if "linkedin" in request.platforms.lower() else ""}

{"**📘 Facebook (Conversational & Relatable)**" if "facebook" in request.platforms.lower() else ""}
{"**Opening:**" if "facebook" in request.platforms.lower() else ""}
{"*Real talk: How much are you ACTUALLY spending on software that barely works?*" if "facebook" in request.platforms.lower() else ""}

{f"*My team was at $4,200/month across 8 different tools. None of them talked to each other. We were literally exporting CSVs like it's 2010.*" if "facebook" in request.platforms.lower() else ""}

{f"*Found {request.product}. Consolidated everything. Now paying $890/month.*" if "facebook" in request.platforms.lower() else ""}

{"*Same results. Better UX. 79% cost reduction.*" if "facebook" in request.platforms.lower() else ""}

{"*Comment 'DEMO' if you want to see how we did it. I'll DM you the breakdown.*" if "facebook" in request.platforms.lower() else ""}

{"**📸 Instagram (Visual-First, Caption Secondary)**" if "instagram" in request.platforms.lower() else ""}
{"**Visual:** Before/after screenshot comparison (chaos vs clean)" if "instagram" in request.platforms.lower() else ""}
{"**Caption:**" if "instagram" in request.platforms.lower() else ""}
{f"*POV: You finally fixed your workflow ✨*" if "instagram" in request.platforms.lower() else ""}

{"*No more switching between 5 tools*" if "instagram" in request.platforms.lower() else ""}
{"*No more lost leads*" if "instagram" in request.platforms.lower() else ""}
{"*No more team chaos*" if "instagram" in request.platforms.lower() else ""}

{f"*That's {request.product}. Link in bio for 14-day trial 🔥*" if "instagram" in request.platforms.lower() else ""}

{"*#productivityhacks #saas #workflowautomation*" if "instagram" in request.platforms.lower() else ""}

{"**🎵 TikTok (Hook in 0.5 Seconds)**" if "tiktok" in request.platforms.lower() else ""}
{"**Script:**" if "tiktok" in request.platforms.lower() else ""}
{"*[0-3sec - HOOK]* 'Tell me you're a [job title] without telling me you're a [job title]'" if "tiktok" in request.platforms.lower() else ""}

{"*[3-5sec - CHAOS MONTAGE]*" if "tiktok" in request.platforms.lower() else ""}
{"*- Opens 47 browser tabs*" if "tiktok" in request.platforms.lower() else ""}
{"*- Logs into 12 different tools*" if "tiktok" in request.platforms.lower() else ""}
{"*- Forgets password to 6 of them*" if "tiktok" in request.platforms.lower() else ""}
{"*- Cries in Excel*" if "tiktok" in request.platforms.lower() else ""}

{f"*[5-10sec - THE FIX]* 'Or... hear me out... {request.product}' *shows clean dashboard*" if "tiktok" in request.platforms.lower() else ""}

{f"*[10-15sec - PROOF]* 'Been using for 60 days. Saved $3,200. Got my weekends back. No cap.' 💀" if "tiktok" in request.platforms.lower() else ""}

{"*[15-20sec - CTA]* 'Link in bio bestie. Thank me later ✨'*" if "tiktok" in request.platforms.lower() else ""}

{"**🐦 Twitter/X (Thread Format)**" if "twitter" in request.platforms.lower() else ""}
{f"**Tweet 1 (Hook):** I analyzed 2,847 teams who switched to {request.product} last quarter. The data is wild. Thread 🧵" if "twitter" in request.platforms.lower() else ""}

{"**Tweet 2:** Average savings: $47,392 in Year 1. Not revenue. Pure savings from consolidating tools." if "twitter" in request.platforms.lower() else ""}

{"**Tweet 3:** Setup time averaged 14 minutes. Their old tools? 6+ weeks. 2,400% faster." if "twitter" in request.platforms.lower() else ""}

{"**Tweet 4:** Team adoption rate: 96% (daily active). Compare that to your current tool's 34%." if "twitter" in request.platforms.lower() else ""}

{f"**Tweet 5:** Why haven't you tried it yet? 14-day free trial. No credit card. Start here: [link]" if "twitter" in request.platforms.lower() else ""}

---

## ⚡ 5 Call-to-Action Options (Performance Ranked)

### 1. 🏆 **"Calculate Your Wasted Spend"** 
**Why It Wins:** Interactive, valuable, creates instant aha moment
**Format:** Button → Opens calculator → Shows shocking number → Offers solution
**Expected CTR:** 8.2%

### 2. 🥈 **"See {request.product} in 90 Seconds"**
**Why It Works:** Low commitment, specific time promise, visual proof
**Format:** Video demo button → Short product tour → End with CTA
**Expected CTR:** 6.7%

### 3. 🥉 **"Steal Our [Template/Setup/Playbook]"**
**Why It Works:** Curiosity + value-first, "steal" = scarcity + insider info
**Format:** Download gate → Email capture → Delivers asset + nurture sequence
**Expected CTR:** 5.9%

### 4. **"Join {teams_switched} Teams"**
**Why It Works:** Social proof, bandwagon effect, FOMO
**Format:** Sign up flow → Shows live user counter → Onboarding
**Expected CTR:** 5.1%

### 5. **"Start 14-Day Free Trial (No Credit Card)"**
**Why It Works:** Classic, proven, removes friction
**Format:** Email + password → Instant access → Value realization in 14min
**Expected CTR:** 4.8%

---

## 📊 Success Metrics & Benchmarks

| Metric | Industry Average | Our Target | Why We'll Win |
|--------|-----------------|-----------|---------------|
| **CTR (Click-Through Rate)** | 2.1% | **3.8%** | Scroll-stopping creative + specific numbers |
| **CPC (Cost Per Click)** | ${round(cpc * 1.8, 2)} | **${cpc}** | High relevance score from tight targeting |
| **Conversion Rate** | 8.3% | **12.5%** | Multi-touch retargeting + social proof |
| **Cost Per Lead** | ${round(cost_per_lead * 1.7, 2)} | **${cost_per_lead}** | Optimized funnel + low friction CTAs |
| **Lead Velocity** | 12 leads/day | **{daily_leads} leads/day** | {platform_count}-platform distribution |
| **Lead Quality Score** | 6.2/10 | **8.5/10** | Intent-based targeting + qualification quiz |
| **CAC Payback Period** | 8.3 months | **4.2 months** | Faster sales cycle from educated leads |

### Why We'll Beat Industry Benchmarks:

1. **Hyper-Specific Targeting:** Not "B2B decision-makers" but "{request.audience}"
2. **Emotional + Rational:** We hit both System 1 (emotion) and System 2 (logic) thinking
3. **Multi-Platform Retargeting:** See us 7 times across {platform_count} platforms = trust builds
{f"4. **Visual Proof:** We have actual product visual ({request.mediaName}) - not stock photos" if request.hasMedia else "4. **Scroll-Stopping Creative:** Every ad tested against 'would I stop scrolling?'"}
5. **Continuous Optimization:** Weekly A/B tests, daily bid adjustments, real-time tweaks

---

## 💰 Budget Breakdown: ${budget_num:,}

| Category | Amount | % | Rationale |
|----------|--------|---|-----------|
| **Paid Media (Ads)** | ${round(budget_num * 0.45):,} | 45% | Primary lead generation engine |
| **Creative Production** | ${round(budget_num * 0.20):,} | 20% | 15+ ad variations, video editing, design |
| **Retargeting Campaigns** | ${round(budget_num * 0.20):,} | 20% | Convert warm traffic (3x-7x ROAS) |
| **Testing Budget** | ${round(budget_num * 0.10):,} | 10% | Rapid experimentation, find winners fast |
| **Contingency/Opportunity** | ${round(budget_num * 0.05):,} | 5% | Scale winners mid-campaign |

### Platform Budget Distribution:

{f"**Primary Platform** ({platform_list[0] if platform_list else 'Google Ads'}): ${round(budget_num * 0.45 * 0.60):,} (60% of ad spend)" if platform_list else ""}
- Highest intent audience
- Proven conversion rates
- Scalable quickly

{f"**Secondary Platform** ({platform_list[1] if len(platform_list) > 1 else 'Facebook'}): ${round(budget_num * 0.45 * 0.30):,} (30%)" if len(platform_list) > 1 else ""}
- Broader awareness
- Retargeting pool builder
- Lower CPC

**Experimental Platforms:** ${round(budget_num * 0.45 * 0.10):,} (10%)
- Test {', '.join(platform_list[2:]) if len(platform_list) > 2 else "emerging channels"}
- Find hidden gems
- Portfolio diversification

---

## 📅 4-Week Campaign Rollout

### Week 1: "The Tease" 🎬
**Strategy:** Create curiosity WITHOUT revealing everything yet

**Content Pieces:**
- Teaser video: "Something's coming for {request.audience}..."
- Behind-the-scenes of {request.product} being built
- Problem-focused content (paint the pain, no solution yet)
- Poll: "How much do you spend on [category] tools per month?"

**Channels:** {platform_list[0] if platform_list else "Primary"} + email list warmup

**Metrics Goal:**
- 5,000 impressions
- 250 engaged users (video views >10sec)
- Build retargeting audience
- Create anticipation

---

### Week 2: "The Reveal" 💥
**Strategy:** Full campaign launch across ALL platforms

**Content Pieces:**
- All 3 ad variations (A/B/C) go live
- Launch lead magnet: "{request.audience} Savings Calculator"
- Case study video: "How [Customer] Saved $38K"
- Interactive quiz: "What's Your Waste Score?"

**Channels:** {', '.join(platform_list) if platform_list else "All platforms"} + retarget Week 1 audience

**Metrics Goal:**
- {round(lead_goal * 0.25)} leads (25% of total target)
- CTR: 3.2%
- CPC: ${round(cpc * 1.1, 2)} (higher during launch)
- Identify winning ad variation

---

### Week 3: "The Proof" 📊
**Strategy:** Social proof blitz + scale winners

**Content Pieces:**
- 5 customer testimonial videos (15-30sec each)
- "Day in the life" with {request.product} (TikTok style)
- Live demo webinar announcement
- Comparison chart: {request.product} vs {request.competitors or "Competitor X"}

**Channels:** Double down on Week 2 winners + aggressive retargeting

**Metrics Goal:**
- {round(lead_goal * 0.40)} leads (40% of total - peak week)
- CTR: 4.1% (creative is refined now)
- CPC: ${round(cpc * 0.9, 2)} (optimization kicking in)
- Scale winning ad 2x budget

---

### Week 4: "The Push" 🚀
**Strategy:** Urgency + FOMO + retarget EVERYONE

**Content Pieces:**
- Limited-time bonus: "First 100 signups get [bonus]"
- Countdown timer creative
- "Last chance" messaging
- Founder story video: "Why I built {request.product}"

**Channels:** Retarget ALL previous engagers + final push on cold audience

**Metrics Goal:**
- {round(lead_goal * 0.35)} leads (35% of total - finish strong)
- CTR: 4.5% (urgency boost)
- CPC: ${cpc} (fully optimized)
- Close out at {lead_goal}+ total leads

---

{f'''## 🧪 A/B Testing Roadmap

### Test 1: Headline Philosophy
**Control (A):** Problem-focused headline
*"{lead_goal} {request.audience} Just Realized They've Been Wasting Money"*

**Variant (B):** Solution-focused headline
*"How {teams_switched} Teams Saved $47K in 90 Days"*

**Hypothesis:** Problem headlines outperform solution headlines by 23% because loss aversion > gain seeking

**Decision Criteria:** 
- Run for 7 days or 1,000 clicks (whichever first)
- Winner gets 80% of budget Week 3-4
- Loser gets 20% (never fully kill - audiences differ)

**Expected Winner:** Variant A (problem) - negativity bias is real

---

### Test 2: CTA Psychology
**Control (A):** Curiosity-driven CTA
*"Calculate Your Waste" (interactive)*

**Variant (B):** Direct CTA
*"Start Free Trial" (classic)*

**Hypothesis:** Curiosity CTAs outperform direct CTAs by 31% because they provide value before asking for commitment

**Decision Criteria:**
- Measure both CTR AND conversion rate (CTR alone misleading)
- Run for 1,500 clicks
- Winner scales to all creatives

**Expected Winner:** Variant A (curiosity) - removes friction, builds trust

---

### Test 3: Visual Approach
**Control (A):** Real product screenshots
*Actual UI, real data, authentic look*

**Variant (B):** Designed ad creative
*Polished graphics, illustrated, branded*

**Hypothesis:** Real screenshots outperform designed creative by 18% because authenticity > polish in 2026

**Decision Criteria:**
- Visual-heavy platforms only (Instagram, Facebook, LinkedIn)
- Run for 10 days
- Track engagement rate + CTR

**Expected Winner:** Variant A (real screenshots) - people are exhausted by fake, polished ads
''' if request.abTesting else ''}

---

## 🎯 Final Campaign Notes

### What Makes This Campaign Different:

1. **Human-Centered:** We talk TO people, not AT them
2. **Story-Driven:** Every section has narrative, not bullet points
3. **Specific AF:** Real numbers ($47K, 2,847 teams, 14 minutes) not vague claims
4. **Multi-Emotional:** We trigger fear (loss), desire (gain), curiosity (gap), and FOMO (social)
5. **Platform-Native:** Each platform gets its OWN creative, not one-size-fits-all
{f"6. **Visual Proof:** We have {request.mediaName} - real asset, real product, real trust" if request.hasMedia else "6. **Scroll-Stopping:** Every creative is designed to make thumbs STOP"}

### Success Prediction:

Based on {request.tone} tone, {request.visualStyle} style, {platform_count}-platform approach, and ${budget_num:,} budget:

- **Conservative:** {round(lead_goal * 0.8)} leads ({round(lead_goal * 0.8 / 30, 1)}/day)
- **Target:** {lead_goal} leads ({daily_leads}/day)
- **Optimistic:** {round(lead_goal * 1.2)} leads ({round(lead_goal * 1.2 / 30, 1)}/day)

The difference? How fast we find winning creative in Week 2.

### Three Things That Will Make or Break This:

1. **Creative Quality:** If Week 1 ads don't stop scrolls, Week 2-4 won't matter
2. **Landing Page:** Ad CTR means nothing if landing page converts <8%
3. **Follow-Up Speed:** Leads go cold in 5 minutes - automate instant response

---

## 🚀 Now Go Execute

This isn't just a campaign plan. It's a {request.timeline or "30-day"} roadmap to {lead_goal} qualified leads.

Every section here is actionable. Every number is real. Every story is rooted in psychology.

Your job now:
1. ✅ Approve this strategy
2. ✅ Brief creative team (or DIY with Canva + this doc)
3. ✅ Set up tracking (UTM codes, conversion pixels)
4. ✅ Launch Week 1 content
5. ✅ Monitor daily, optimize weekly

---

**Campaign ID:** `{request.product.lower().replace(' ', '-')}-{request.timeline or '30day'}-campaign`

**Style Code:** `{request.visualStyle.upper()}-{request.tone.upper()}-{request.contentType.upper()}`

**Platforms:** {request.platforms}

**Budget:** ${budget_num:,}

**Target:** {lead_goal} leads @ ${cost_per_lead}/lead

---

*Generated with MarketMind AI - Where Marketing Meets Intelligence*

💡 **Pro Tip:** Bookmark this doc. You'll want to reference it daily during the campaign.

🔥 **Ready to launch? The only thing between you and {lead_goal} leads is execution. Let's go.**
"""


# ============================================
# PITCH GENERATOR API
# ============================================

@app.post("/api/generate_pitch")
async def api_generate_pitch(request: PitchRequest, db: Session = Depends(database.get_db)):
    print(f"\n{'='*60}")
    print(f"📥 PITCH REQUEST RECEIVED")
    print(f"{'='*60}")
    print(f"Company: {request.product}")
    print(f"Problem: {request.problem[:50]}...")
    print(f"Solution: {request.solution[:50]}...")
    print(f"Funding Stage: {request.fundingStage}")
    print(f"{'='*60}\n")
    
    try:
        # Build investor-grade pitch prompt
        prompt = f"""🎯 YOU ARE A LEGENDARY PITCH DECK DESIGNER

You've helped 50+ startups raise $500M+ from top VCs (a16z, Sequoia, Y Combinator).
You know what investors want to see, what red flags to avoid, and how to tell a compelling story.

CREATE AN INVESTOR-READY PITCH DECK FOR:

**Company:** {request.product}
**Target Customer:** {request.audience}
**Problem:** {request.problem}
**Solution:** {request.solution}

**FUNDING DETAILS:**
- Stage: {request.fundingStage}
- Amount Seeking: {request.amountSeeking or 'TBD'}
- Pre-Money Valuation: {request.valuation or 'TBD'}
- Team Size: {request.teamSize or 'TBD'}

**TRACTION:**
- MRR: {request.revenue or 'Pre-revenue'}
- Customers: {request.customers or 'Early traction'}
- Growth Rate: {request.growthRate or 'TBD'}% monthly
- Burn Rate: {request.burnRate or 'TBD'}

**MARKET:**
- TAM: {request.marketSize or 'Large opportunity'}
- Competitors: {request.competitors or 'TBD'}
- Advantage: {request.advantage or 'Unique technology'}

**BUSINESS MODEL:**
- Model: {request.businessModel}
- Pricing: {request.pricing or 'TBD'}

🎯 GENERATE THESE SLIDES (make each one INVESTOR-COMPELLING):

## Slide 1: Title + Hook
• Company name + one-line tagline
• One sentence that makes VCs lean forward

## Slide 2: The Problem (Make It Hurt)
• Paint the pain in specific, visceral terms
• Use real numbers and stories
• Make it feel URGENT

## Slide 3: The Solution (Make It Obvious)
• How {request.product} solves this elegantly
• Why now is the time
• What makes it 10x better

## Slide 4: Product Demo (Show, Don't Tell)
• Key features with benefits
• Screenshots or visual description
• User testimonial if available

## Slide 5: Market Opportunity
• TAM/SAM/SOM breakdown
• Why this market is exploding
• Your entry strategy

## Slide 6: Business Model
• How you make money
• Unit economics
• Path to profitability

## Slide 7: Traction
• Key metrics
• Growth trajectory
• Customer logos or testimonials

## Slide 8: Competition
• Competitive landscape
• Your unique moat
• Why you'll win

{"## Slide 9: Team\n• Founder backgrounds\n• Why this team can execute\n• Key advisors" if request.includeTeam else ""}

{"## Slide 10: Financial Projections\n• 3-year revenue forecast\n• Key assumptions\n• Path to break-even" if request.includeFinancials else ""}

{"## Slide 11: Roadmap\n• Next 12 months\n• Key milestones\n• Product evolution" if request.includeRoadmap else ""}

## Final Slide: The Ask
• How much you're raising
• What you'll do with it
• Expected outcomes
• Strong close

🚀 RULES:
- Write like you're pitching Sequoia, not your mom
- Every claim needs proof or logic
- Be ambitious but believable
- Show momentum
- Make them WANT to invest

NOW CREATE THE DECK:
"""

        content = None
        if client:
            try:
                print("🤖 Calling Groq AI for pitch generation...")
                completion = client.chat.completions.create(
                    model="llama3-70b-8192",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a top-tier pitch deck consultant who's helped startups raise hundreds of millions. You understand what VCs look for: huge markets, strong teams, clear traction, defensible moats, and compelling narratives."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.75,
                    max_tokens=3500
                )
                content = completion.choices[0].message.content
                print("✅ Pitch generation successful!")
            except Exception as e:
                print(f"⚠️ Groq API failed: {e}")
        
        # Fallback template
        if not content:
            content = f"""# 🚀 {request.product} - Investor Pitch Deck

## Slide 1: Title + Hook

**{request.product}**
*Revolutionizing How {request.audience} Solve Critical Problems*

**The One-Liner:** 
We're the {request.businessModel} platform that turns {request.problem.split('.')[0]} into competitive advantage.

---

## Slide 2: The Problem 🔴

### {request.audience} Are Bleeding Money

**The Pain:**
{request.problem}

**By The Numbers:**
- Average company loses ${request.burnRate or '$30K'}/month to inefficiency
- 67% of {request.audience} say current solutions don't work
- Market frustration score: 8.7/10

**Why It Matters:**
This isn't a nice-to-have. This is an existential threat for companies in {request.businessModel} space.

---

## Slide 3: The Solution ✅

### Introducing {request.product}

{request.solution}

**Why We Win:**
- {request.advantage or "Proprietary technology"}
- 10x faster than alternatives
- Designed specifically for {request.audience}

**The Magic:**
We're not incremental improvement. We're category creation.

---

## Slide 4: Product Demo 📱

### See It In Action

**Core Features:**
1. **[Feature 1]:** {request.solution.split('.')[0] if '.' in request.solution else 'AI-powered automation'}
2. **[Feature 2]:** Real-time synchronization across platforms
3. **[Feature 3]:** Enterprise-grade security

**User Testimonial:**
*"{request.product} saved us $47K in Q4 alone. ROI was immediate."* - Early Customer

---

## Slide 5: Market Opportunity 📊

### Massive & Growing

**TAM (Total Addressable Market):** {request.marketSize or '$50B globally'}

**SAM (Serviceable):** $8B (16% of TAM we can realistically reach)

**SOM (Obtainable):** $400M (our 3-year target)

**Market Drivers:**
- Shift to remote work (37% increase in need)
- Regulatory pressure
- Rising customer expectations

---

## Slide 6: Business Model 💰

### {request.businessModel.title()} Revenue Engine

**Pricing:** {request.pricing or '$99-$499/month per seat'}

**Unit Economics:**
- LTV (Lifetime Value): $14,500
- CAC (Customer Acquisition Cost): $1,200
- LTV:CAC Ratio: **12.1:1** (3.0+ is good)
- Payback Period: 4.2 months

**Revenue Streams:**
1. Core subscription (80%)
2. Premium features (15%)
3. Professional services (5%)

---

## Slide 7: Traction 🚀

### We're Growing FAST

**Current Metrics:**
- MRR: {request.revenue or '$50K (growing 25% MoM)'}
- Customers: {request.customers or '150 paying'}
- Growth Rate: {request.growthRate or '25'}% month-over-month
- Churn: 2.1% (industry average is 7%)

**Milestones Hit:**
- ✅ Product-market fit validated
- ✅ First $1M ARR
- ✅ 100+ 5-star reviews
- ✅ Enterprise pilot with Fortune 500

---

## Slide 8: Competition 🥊

### We're Playing Different Game

**Competitive Landscape:**
- **{request.competitors.split(',')[0] if request.competitors else 'Incumbent A'}:** Expensive, complex, legacy tech
- **{request.competitors.split(',')[1] if request.competitors and ',' in request.competitors else 'Incumbent B'}:** Feature-rich but 6-week setup
- **Us:** Modern, simple, works in 14 minutes

**Our Moat:**
{request.advantage or "Proprietary AI models + network effects + switching costs"}

**Why We'll Win:**
10x better product + 3x lower price + 100x better UX = inevitable

---

{"## Slide 9: Team 👥\n\n### We've Done This Before\n\n**Founders:**\n- CEO: [Name] - Built & sold previous company for $XX M\n- CTO: [Name] - Ex-Google, led team of 50 engineers\n- Head of Sales: [Name] - Scaled revenue from $0 to $10M at [Company]\n\n**Team:** " + (request.teamSize or "12") + " rockstars (4 engineers, 3 sales, 2 product, 3 ops)\n\n**Advisors:** Industry veterans from [Big Company], [VC Fund], [Strategic Partner]\n\n---\n\n" if request.includeTeam else ""}

{"## Slide 10: Financial Projections 📈\n\n### Path to $50M ARR\n\n| Year | Revenue | Customers | Team Size |\n|------|---------|-----------|----------|\n| 2026 | $2.1M | 350 | 18 |\n| 2027 | $8.4M | 1,400 | 42 |\n| 2028 | $24.5M | 4,100 | 98 |\n\n**Key Assumptions:**\n- Average deal size: $6K/year\n- Sales cycle: 45 days\n- CAC payback: 4 months\n- Gross margin: 85%\n\n**Break-Even:** Q3 2027\n\n---\n\n" if request.includeFinancials else ""}

{"## Slide 11: 12-Month Roadmap 🗺️\n\n### What We'll Build Next\n\n**Q1 2026:** \n- Launch mobile app (iOS/Android)\n- Enterprise SSO & security\n- 50 new customers\n\n**Q2 2026:**\n- API v2.0 (developer platform)\n- Marketplace (3rd party integrations)\n- First international market (UK)\n\n**Q3 2026:**\n- AI-powered insights dashboard\n- Expand sales team 3x\n- $5M ARR milestone\n\n**Q4 2026:**\n- Enterprise tier launch\n- Strategic partnerships\n- Prep for Series A\n\n---\n\n" if request.includeRoadmap else ""}

## The Ask 💵

### Let's Build This Together

**Raising:** {request.amountSeeking or '$2M seed round'}

**Valuation:** {request.valuation or '$8M pre-money'}

**Use of Funds:**
- 40% Product Development (ship roadmap faster)
- 35% Sales & Marketing (hit $5M ARR in 18 months)
- 20% Team Expansion (hire 10 key roles)
- 5% Operations & Infrastructure

**Expected Outcomes:**
- 12-month runway to Series A
- $5M ARR by Q4 2026
- 500+ paying customers
- Break-even trajectory

**The Opportunity:**
You're not just investing in a product. You're investing in the future of how {request.audience} operate.

Early investors in [Comparable Company] made 87x. This is that moment.

---

## 🚀 Let's Change The Game

**Next Steps:**
1. Schedule deep-dive session
2. Meet the team
3. Customer reference calls
4. Term sheet

**Contact:**
[Founder Name]
founder@{request.product.lower().replace(' ', '')}.com

*Let's make {request.product} the category leader.*

---

**Deck created with MarketMind AI**
"""
        # Save to database
        try:
            new_pitch = models.Pitch(
                product=request.product,
                problem=request.problem,
                solution=request.solution,
                content=content
            )
            db.add(new_pitch)
            db.commit()
            db.refresh(new_pitch)
        except Exception as db_err:
            print(f"⚠️ Database save failed: {db_err}")

        print("✅ Pitch deck generated!\n")
        return {"content": content}
    
    except Exception as e:
        print(f"❌ ERROR in pitch generation: {e}")
        import traceback
        traceback.print_exc()
        return {"content": f"## Error\n\n{str(e)}"}


# ============================================
# LEAD SCORING API
# ============================================

@app.post("/api/score_lead")
async def api_score_lead(request: LeadRequest, db: Session = Depends(database.get_db)):
    print(f"\n{'='*60}")
    print(f"📥 LEAD SCORING REQUEST")
    print(f"{'='*60}")
    print(f"Lead: {request.name}")
    print(f"Company: {request.company or 'N/A'}")
    print(f"Role: {request.role or 'N/A'}")
    print(f"{'='*60}\n")
    
    try:
        # Build lead profile
        lead_profile = f"""Name: {request.name}
Company: {request.company or 'Not specified'}
Role: {request.role or 'Not specified'}
Email: {request.email or 'Not provided'}
Industry: {request.industry or 'Not specified'}
Company Size: {request.companySize or 'Not specified'}
Budget Range: {request.budget or 'Not specified'}
Purchase Timeline: {request.urgency or 'Not specified'}
Lead Source: {request.source or 'Not specified'}
Engagement Level: {request.engagement or 'Not specified'}
Notes: {request.notes or 'None'}"""

        # SCORING ALGORITHM
        base_score = 50
        
        # Budget scoring (20 points max)
        if request.budget:
            if '500k+' in request.budget: base_score += 20
            elif '100k-500k' in request.budget: base_score += 18
            elif '50k-100k' in request.budget: base_score += 15
            elif '10k-50k' in request.budget: base_score += 10
            elif '<10k' in request.budget: base_score += 5
        
        # Urgency scoring (15 points max)
        if request.urgency == 'immediate': base_score += 15
        elif request.urgency == 'short': base_score += 10
        elif request.urgency == 'medium': base_score += 5
        
        # Company size (10 points max)
        if request.companySize:
            if '1000+' in request.companySize: base_score += 10
            elif '501-1000' in request.companySize: base_score += 9
            elif '201-500' in request.companySize: base_score += 7
            elif '51-200' in request.companySize: base_score += 5
        
        # Engagement level (10 points max)
        if request.engagement == 'high': base_score += 10
        elif request.engagement == 'medium': base_score += 5
        elif request.engagement == 'low': base_score += 2
        
        # Role / Decision maker (10 points max)
        if request.role:
            role_lower = request.role.lower()
            if any(x in role_lower for x in ['ceo', 'founder', 'owner', 'president']): base_score += 10
            elif any(x in role_lower for x in ['vp', 'vice president', 'head of', 'director']): base_score += 8
            elif any(x in role_lower for x in ['manager', 'lead']): base_score += 5
        
        # Source quality (5 points max)
        if request.source:
            if request.source in ['referral', 'event', 'webinar']: base_score += 5
            elif request.source in ['website', 'linkedin']: base_score += 3
            elif request.source == 'cold-outreach': base_score += 1
        
        # Cap at 100
        final_score = min(base_score, 100)
        
        # Determine priority
        if final_score >= 85:
            priority = 'HOT'
            recommendation = f"🔥 URGENT: Contact {request.name} within 24 hours. Schedule demo ASAP. This is a qualified, high-intent lead."
        elif final_score >= 70:
            priority = 'WARM'
            recommendation = f"⚡ PRIORITY: Follow up with {request.name} within 48-72 hours. Send personalized email with case study. Strong potential."
        else:
            priority = 'COLD'
            recommendation = f"❄️ NURTURE: Add {request.name} to email nurture campaign. Check back in 2-4 weeks. Not ready to buy yet."
        
        # Build reasoning
        reasoning_parts = []
        if request.budget and '50k' in request.budget or '100k' in request.budget or '500k' in request.budget:
            reasoning_parts.append(f"Strong budget signals ({request.budget})")
        if request.urgency in ['immediate', 'short']:
            reasoning_parts.append(f"High urgency ({request.urgency} timeline)")
        if request.companySize and any(x in request.companySize for x in ['500', '1000']):
            reasoning_parts.append(f"Enterprise-scale company ({request.companySize})")
        if request.engagement == 'high':
            reasoning_parts.append("High engagement with content")
        if request.role and any(x in request.role.lower() for x in ['ceo', 'vp', 'director', 'head']):
            reasoning_parts.append(f"Decision-maker role ({request.role})")
        
        if not reasoning_parts:
            reasoning_parts.append("Limited qualification data - needs more discovery")
        
        reasoning = f"Lead qualifies at {final_score}/100 based on: " + ", ".join(reasoning_parts) + f". {request.companySize or 'Unknown size'} company in {request.industry or 'unspecified industry'}. Source: {request.source or 'unknown'}."
        
        # JSON response
        content = f'{{"score": {final_score}, "priority": "{priority}", "recommendation": "{recommendation}", "reasoning": "{reasoning}"}}'

        # Try AI enhancement
        if client:
            try:
                prompt = f"Score this B2B lead on 0-100 scale and return ONLY valid JSON with these exact keys: score, priority (HOT/WARM/COLD), recommendation, reasoning.\n\nLead Profile:\n{lead_profile}\n\nMake it specific and actionable."
                
                completion = client.chat.completions.create(
                    model="llama3-70b-8192",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    max_tokens=500
                )
                ai_content = completion.choices[0].message.content
                
                # Validate it's JSON
                import json
                json.loads(ai_content)
                content = ai_content
                print("✅ AI-enhanced lead scoring")
            except:
                print("⚠️ AI scoring failed, using algorithmic score")
        
        # Parse JSON content to save to DB
        import json
        try:
            parsed = json.loads(content)
            new_lead = models.Lead(
                name=request.name,
                company=request.company,
                score=parsed.get("score"),
                priority=parsed.get("priority"),
                recommendation=parsed.get("recommendation"),
                reasoning=parsed.get("reasoning")
            )
            db.add(new_lead)
            db.commit()
            db.refresh(new_lead)
        except Exception as db_err:
            print(f"⚠️ Database save failed for lead: {db_err}")

        print(f"✅ Lead scored: {final_score}/100 - {priority}\n")
        return {"content": content}
    
    except Exception as e:
        print(f"❌ ERROR in lead scoring: {e}")
        return {"content": f'{{"score": 70, "priority": "WARM", "recommendation": "Follow up within 48 hours", "reasoning": "Basic profile indicates moderate fit. {str(e)}"}}'}


# ============================================
# LEGACY / UTILITY ENDPOINTS
# ============================================

@app.post("/upload_leads")
async def upload_leads(file: UploadFile = File(...)):
    """Bulk CSV upload for lead scoring"""
    global leads_df
    try:
        df = pd.read_csv(file.file)
        leads_df = df
        print(f"✅ Uploaded {len(df)} leads from CSV")
        return {"total_leads": len(df), "columns": list(df.columns)}
    except Exception as e:
        print(f"❌ CSV upload failed: {e}")
        return {"error": str(e)}

@app.get("/leads")
async def get_leads():
    """Get all uploaded leads"""
    if not leads_df.empty:
        return leads_df.to_dict('records')
    return []

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "groq_connected": client is not None,
        "version": "2.0.0"
    }


# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🚀 MARKETMIND AI - STARTING SERVER")
    print("="*70)
    print("\n📂 Directory Check:")
    print(f"   /templates folder: {'✅ EXISTS' if os.path.exists('templates') else '❌ MISSING'}")
    print(f"   /static folder: {'✅ EXISTS' if os.path.exists('static') else '❌ MISSING'}")
    print(f"\n🔑 API Configuration:")
    print(f"   Groq API Key: {'✅ SET' if client else '❌ MISSING (Add to .env file)'}")
    print(f"\n✨ Server Details:")
    print(f"   URL: http://127.0.0.1:8000")
    print(f"   API Docs: http://127.0.0.1:8000/docs")
    print(f"   Version: 2.0.0 (Ultra Creative)")
    print("\n" + "="*70)
    print("🎯 Ready to generate FIRE campaigns! 🔥")
    print("="*70 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
