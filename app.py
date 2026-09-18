"""
Habit & Routine Tracker - Streamlit Application
A full-featured personal productivity, habit formation, routine scheduling,
diet & macronutrient tracking, and wellness analytics dashboard.

Run with:
    streamlit run app.py
"""

import json
import os
from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional
import streamlit as st
import pandas as pd

# -----------------------------------------------------------------------------
# Configuration & Page Setup
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Habit & Routine Tracker",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded",
)

DATA_FILE = "habit_tracker_data.json"

# -----------------------------------------------------------------------------
# Default Starter Data
# -----------------------------------------------------------------------------
DEFAULT_GOALS = {
    "calorieTarget": 2150,
    "proteinTarget": 140,
    "carbsTarget": 220,
    "fatTarget": 65,
    "waterTargetMl": 2800,
    "dailySleepTargetHours": 8.0,
}

DEFAULT_HABITS = [
    {
        "id": "habit-1",
        "title": "Morning Hydration",
        "description": "Drink 500ml pure water upon waking to rehydrate",
        "category": "health",
        "color": "sky",
        "icon": "💧",
        "frequency": "daily",
        "type": "numeric",
        "targetValue": 500,
        "unit": "ml",
        "createdAt": "2026-09-01",
    },
    {
        "id": "habit-2",
        "title": "Daily Movement / Workout",
        "description": "30+ minutes of resistance training, cardio, or brisk walking",
        "category": "fitness",
        "color": "emerald",
        "icon": "⚡",
        "frequency": "daily",
        "type": "numeric",
        "targetValue": 30,
        "unit": "mins",
        "createdAt": "2026-09-01",
    },
    {
        "id": "habit-3",
        "title": "Read 15 Pages",
        "description": "Non-fiction, technical, or personal development literature",
        "category": "mind",
        "color": "indigo",
        "icon": "📖",
        "frequency": "daily",
        "type": "numeric",
        "targetValue": 15,
        "unit": "pages",
        "createdAt": "2026-09-01",
    },
    {
        "id": "habit-4",
        "title": "Mindful Meditation",
        "description": "10 minutes of box breathing or calm guided awareness",
        "category": "mind",
        "color": "teal",
        "icon": "🧘",
        "frequency": "daily",
        "type": "numeric",
        "targetValue": 10,
        "unit": "mins",
        "createdAt": "2026-09-01",
    },
    {
        "id": "habit-5",
        "title": "Clean Diet (Zero Junk Sugar)",
        "description": "No soda, processed candy, or deep-fried fast food",
        "category": "diet",
        "color": "amber",
        "icon": "🥗",
        "frequency": "daily",
        "type": "boolean",
        "createdAt": "2026-09-01",
    },
    {
        "id": "habit-6",
        "title": "Digital Wind-Down",
        "description": "Put screens away 45 minutes before sleep",
        "category": "lifestyle",
        "color": "rose",
        "icon": "🌙",
        "frequency": "daily",
        "type": "boolean",
        "createdAt": "2026-09-01",
    },
]

DEFAULT_ROUTINES = [
    {
        "id": "routine-1",
        "title": "Wake up, hydrate & sunlight exposure",
        "phase": "morning",
        "time": "07:00",
        "durationMinutes": 15,
        "category": "Health",
        "notes": "Open blinds, drink 500ml water",
    },
    {
        "id": "routine-2",
        "title": "Quick mobility & physical activation",
        "phase": "morning",
        "time": "07:20",
        "durationMinutes": 15,
        "category": "Fitness",
        "notes": "Spine stretches, bodyweight squats, deep breaths",
    },
    {
        "id": "routine-3",
        "title": "High-protein breakfast & planning",
        "phase": "morning",
        "time": "08:00",
        "durationMinutes": 30,
        "category": "Diet",
        "notes": "Review Top 3 priorities for the day",
    },
    {
        "id": "routine-4",
        "title": "Deep Focus Work Block",
        "phase": "afternoon",
        "time": "13:30",
        "durationMinutes": 90,
        "category": "Productivity",
        "notes": "Phones silent, focus mode enabled",
    },
    {
        "id": "routine-5",
        "title": "Midday outdoor walk & mental reset",
        "phase": "afternoon",
        "time": "15:30",
        "durationMinutes": 20,
        "category": "Health",
        "notes": "Brisk pace, hydration refill",
    },
    {
        "id": "routine-6",
        "title": "Nutritious dinner & kitchen tidy",
        "phase": "evening",
        "time": "18:45",
        "durationMinutes": 45,
        "category": "Diet",
        "notes": "Eat without screens, clean counter",
    },
    {
        "id": "routine-7",
        "title": "Evening reading & reflection",
        "phase": "evening",
        "time": "20:30",
        "durationMinutes": 30,
        "category": "Mind",
        "notes": "Jot down tomorrow's priority list",
    },
    {
        "id": "routine-8",
        "title": "Night wind-down & sleep prep",
        "phase": "night",
        "time": "22:15",
        "durationMinutes": 25,
        "category": "Lifestyle",
        "notes": "Dim lights, cool room to 67°F, screens off",
    },
]

FOOD_PRESETS = [
    {"name": "Oatmeal & Fresh Berries with Whey", "type": "breakfast", "cal": 420, "p": 32, "c": 56, "f": 7},
    {"name": "Greek Yogurt Bowl with Honey & Walnuts", "type": "breakfast", "cal": 360, "p": 24, "c": 32, "f": 14},
    {"name": "3 Eggs Scrambled with Avocado & Sourdough", "type": "breakfast", "cal": 460, "p": 25, "c": 28, "f": 26},
    {"name": "Grilled Chicken Rice Bowl with Steamed Broccoli", "type": "lunch", "cal": 560, "p": 48, "c": 62, "f": 12},
    {"name": "Tuna & Quinoa Power Salad with Olive Oil", "type": "lunch", "cal": 480, "p": 38, "c": 42, "f": 18},
    {"name": "Pan-Seared Salmon Fillet with Roasted Asparagus", "type": "dinner", "cal": 590, "p": 44, "c": 18, "f": 36},
    {"name": "Lean Ground Turkey Stir-fry with Sweet Potato", "type": "dinner", "cal": 520, "p": 42, "c": 54, "f": 14},
    {"name": "Isolate Protein Shake with Almond Milk", "type": "snack", "cal": 190, "p": 28, "c": 6, "f": 4},
    {"name": "Handful of Raw Almonds & Apple Slices", "type": "snack", "cal": 220, "p": 6, "c": 24, "f": 14},
]

# -----------------------------------------------------------------------------
# Data Persistence & Session Management
# -----------------------------------------------------------------------------
def get_default_dataset() -> Dict[str, Any]:
    today_str = date.today().isoformat()
    yesterday_str = (date.today() - timedelta(days=1)).isoformat()
    two_days_ago_str = (date.today() - timedelta(days=2)).isoformat()

    return {
        "goals": DEFAULT_GOALS.copy(),
        "habits": DEFAULT_HABITS.copy(),
        "routines": DEFAULT_ROUTINES.copy(),
        "habit_logs": {
            f"{today_str}_habit-1": {"completed": True, "value": 500},
            f"{today_str}_habit-2": {"completed": True, "value": 35},
            f"{today_str}_habit-3": {"completed": False, "value": 0},
            f"{yesterday_str}_habit-1": {"completed": True, "value": 500},
            f"{yesterday_str}_habit-2": {"completed": True, "value": 30},
            f"{yesterday_str}_habit-3": {"completed": True, "value": 20},
            f"{yesterday_str}_habit-4": {"completed": True, "value": 10},
            f"{two_days_ago_str}_habit-1": {"completed": True, "value": 500},
            f"{two_days_ago_str}_habit-2": {"completed": True, "value": 30},
        },
        "routine_logs": {
            today_str: ["routine-1", "routine-2", "routine-3"],
            yesterday_str: ["routine-1", "routine-2", "routine-3", "routine-4", "routine-6"],
            two_days_ago_str: ["routine-1", "routine-2", "routine-4", "routine-5"],
        },
        "diet_logs": {
            today_str: {
                "waterIntakeMl": 1750,
                "meals": [
                    {"id": "m1", "mealType": "breakfast", "name": "Greek Yogurt Bowl with Honey & Walnuts", "calories": 360, "protein": 24, "carbs": 32, "fat": 14, "time": "08:15"},
                    {"id": "m2", "mealType": "lunch", "name": "Grilled Chicken Rice Bowl with Steamed Broccoli", "calories": 560, "protein": 48, "carbs": 62, "fat": 12, "time": "12:45"},
                ],
            },
            yesterday_str: {
                "waterIntakeMl": 2750,
                "meals": [
                    {"id": "m10", "mealType": "breakfast", "name": "Oatmeal & Fresh Berries with Whey", "calories": 420, "protein": 32, "carbs": 56, "fat": 7, "time": "08:00"},
                    {"id": "m11", "mealType": "lunch", "name": "Tuna & Quinoa Power Salad with Olive Oil", "calories": 480, "protein": 38, "carbs": 42, "fat": 18, "time": "13:00"},
                    {"id": "m12", "mealType": "dinner", "name": "Pan-Seared Salmon Fillet with Roasted Asparagus", "calories": 590, "protein": 44, "carbs": 18, "fat": 36, "time": "19:15"},
                    {"id": "m13", "mealType": "snack", "name": "Isolate Protein Shake with Almond Milk", "calories": 190, "protein": 28, "carbs": 6, "fat": 4, "time": "16:30"},
                ],
            },
        },
        "wellness_logs": {
            today_str: {
                "mood": "great",
                "energyLevel": 4,
                "sleepHours": 7.5,
                "sleepQuality": "restful",
                "journalNote": "Felt sharp in the morning after sunlight and hydration. High focus day.",
            },
            yesterday_str: {
                "mood": "good",
                "energyLevel": 4,
                "sleepHours": 8.0,
                "sleepQuality": "restful",
                "journalNote": "Completed workout and hit water targets seamlessly.",
            },
        },
    }

def load_data() -> Dict[str, Any]:
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data
        except Exception:
            pass
    default_data = get_default_dataset()
    save_data(default_data)
    return default_data

def save_data(data: Dict[str, Any]) -> None:
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        st.error(f"Failed to persist data to {DATA_FILE}: {e}")

# Initialize session state from file
if "tracker_data" not in st.session_state:
    st.session_state["tracker_data"] = load_data()

tracker = st.session_state["tracker_data"]

def trigger_save():
    save_data(st.session_state["tracker_data"])

# -----------------------------------------------------------------------------
# Helper Functions: Date, Streaks, and Analytics
# -----------------------------------------------------------------------------
def get_habit_log(habit_id: str, date_str: str) -> Dict[str, Any]:
    key = f"{date_str}_{habit_id}"
    return tracker.get("habit_logs", {}).get(key, {"completed": False, "value": 0})

def set_habit_log(habit_id: str, date_str: str, completed: bool, value: Optional[float] = None):
    if "habit_logs" not in tracker:
        tracker["habit_logs"] = {}
    key = f"{date_str}_{habit_id}"
    tracker["habit_logs"][key] = {
        "completed": completed,
        "value": value if value is not None else (1 if completed else 0),
    }
    trigger_save()

def calculate_habit_streak(habit_id: str, current_date_str: str) -> int:
    streak = 0
    ref_date = datetime.strptime(current_date_str, "%Y-%m-%d").date()
    
    # Check current date first
    if get_habit_log(habit_id, ref_date.isoformat()).get("completed", False):
        streak += 1
        check_date = ref_date - timedelta(days=1)
    else:
        # Check if yesterday was completed
        check_date = ref_date - timedelta(days=1)
        if not get_habit_log(habit_id, check_date.isoformat()).get("completed", False):
            return 0

    while True:
        d_str = check_date.isoformat()
        if get_habit_log(habit_id, d_str).get("completed", False):
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break
    return streak

def get_diet_for_date(date_str: str) -> Dict[str, Any]:
    return tracker.get("diet_logs", {}).get(date_str, {"waterIntakeMl": 0, "meals": []})

def get_nutrition_summary(date_str: str) -> Dict[str, float]:
    diet = get_diet_for_date(date_str)
    meals = diet.get("meals", [])
    calories = sum(m.get("calories", 0) for m in meals)
    protein = sum(m.get("protein", 0) for m in meals)
    carbs = sum(m.get("carbs", 0) for m in meals)
    fat = sum(m.get("fat", 0) for m in meals)
    return {"calories": calories, "protein": protein, "carbs": carbs, "fat": fat}

def get_completed_routines(date_str: str) -> List[str]:
    return tracker.get("routine_logs", {}).get(date_str, [])

def toggle_routine_item(item_id: str, date_str: str):
    if "routine_logs" not in tracker:
        tracker["routine_logs"] = {}
    completed_list = tracker["routine_logs"].get(date_str, [])
    if item_id in completed_list:
        completed_list.remove(item_id)
    else:
        completed_list.append(item_id)
    tracker["routine_logs"][date_str] = completed_list
    trigger_save()

# -----------------------------------------------------------------------------
# Custom Styling (Light & Clean modern UI)
# -----------------------------------------------------------------------------
st.markdown(
    """
    <style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 0.95rem;
        color: #64748b;
        margin-bottom: 1.5rem;
    }
    .stat-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        margin-bottom: 12px;
    }
    .badge-pill {
        display: inline-block;
        padding: 2px 10px;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 9999px;
        background-color: #f1f5f9;
        color: #475569;
    }
    .phase-badge {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #4338ca;
        background: #eef2ff;
        padding: 4px 10px;
        border-radius: 6px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# -----------------------------------------------------------------------------
# Sidebar Navigation & Date Selection
# -----------------------------------------------------------------------------
with st.sidebar:
    st.markdown("### 🎯 Habit & Routine")
    st.markdown("*Precision daily rhythm and lifestyle tracking*")
    st.markdown("---")

    nav_tab = st.radio(
        "Navigation",
        ["📊 Today's Overview", "🎯 Habits", "⏰ Daily Routine", "🥗 Diet & Macros", "📈 Analytics", "⚙️ Settings & Backup"],
        index=0,
    )

    st.markdown("---")
    st.markdown("#### 📅 Active Date")
    
    col_prev, col_today, col_next = st.columns(3)
    if col_prev.button("◀ Prev"):
        st.session_state["selected_date"] = st.session_state.get("selected_date", date.today()) - timedelta(days=1)
        st.rerun()
    if col_today.button("Today"):
        st.session_state["selected_date"] = date.today()
        st.rerun()
    if col_next.button("Next ▶"):
        st.session_state["selected_date"] = st.session_state.get("selected_date", date.today()) + timedelta(days=1)
        st.rerun()

    active_date = st.date_input(
        "Select Calendar Day",
        value=st.session_state.get("selected_date", date.today()),
        key="selected_date_input",
    )
    st.session_state["selected_date"] = active_date
    selected_date_str = active_date.isoformat()

    st.caption(f"Currently viewing: **{active_date.strftime('%A, %b %d, %Y')}**")

# =============================================================================
# VIEW 1: TODAY'S OVERVIEW
# =============================================================================
if nav_tab == "📊 Today's Overview":
    st.markdown(f"<div class='main-header'>Daily Overview</div>", unsafe_allow_html=True)
    st.markdown(f"<div class='sub-header'>Summary and real-time execution for {active_date.strftime('%A, %B %d, %Y')}</div>", unsafe_allow_html=True)

    # 1. High-level metric stats
    habits = tracker.get("habits", [])
    total_habits = len(habits)
    completed_habits = sum(1 for h in habits if get_habit_log(h["id"], selected_date_str).get("completed", False))
    habit_pct = (completed_habits / total_habits * 100) if total_habits > 0 else 0

    routines = tracker.get("routines", [])
    total_routines = len(routines)
    completed_routines_list = get_completed_routines(selected_date_str)
    routine_pct = (len(completed_routines_list) / total_routines * 100) if total_routines > 0 else 0

    diet_info = get_diet_for_date(selected_date_str)
    nutrition = get_nutrition_summary(selected_date_str)
    goals = tracker.get("goals", DEFAULT_GOALS)
    water_ml = diet_info.get("waterIntakeMl", 0)
    water_pct = min(100.0, (water_ml / goals["waterTargetMl"] * 100)) if goals["waterTargetMl"] > 0 else 0

    cal_pct = min(100.0, (nutrition["calories"] / goals["calorieTarget"] * 100)) if goals["calorieTarget"] > 0 else 0

    # Composite consistency score
    composite_score = int((habit_pct * 0.4) + (routine_pct * 0.3) + (water_pct * 0.15) + (min(100, cal_pct) * 0.15))

    col_score, col_habits, col_routine, col_water, col_cals = st.columns(5)
    col_score.metric("Overall Consistency", f"{composite_score}%", help="Weighted average of habit execution, routine adherence, water, and diet targets.")
    col_habits.metric("Habits Completed", f"{completed_habits} / {total_habits}", f"{int(habit_pct)}%")
    col_routine.metric("Routines Done", f"{len(completed_routines_list)} / {total_routines}", f"{int(routine_pct)}%")
    col_water.metric("Water Intake", f"{water_ml} ml", f"{int(water_pct)}% of target")
    col_cals.metric("Calories Consumed", f"{nutrition['calories']} kcal", f"{int(cal_pct)}% of target")

    st.markdown("---")

    # Quick Actions / Checklists
    c_left, c_right = st.columns([1, 1])

    with c_left:
        st.subheader("🎯 Habits Checklist")
        if not habits:
            st.info("No habits defined yet. Go to the Habits tab to create one!")
        for h in habits:
            log = get_habit_log(h["id"], selected_date_str)
            is_done = log.get("completed", False)
            h_val = log.get("value", 0)
            streak = calculate_habit_streak(h["id"], selected_date_str)

            col_chk, col_info, col_val = st.columns([0.1, 0.65, 0.25])
            checked = col_chk.checkbox("", value=is_done, key=f"ov_chk_{h['id']}_{selected_date_str}")
            if checked != is_done:
                set_habit_log(h["id"], selected_date_str, checked, h.get("targetValue") if checked else 0)
                st.rerun()

            desc_text = f" · *{h['description']}*" if h.get("description") else ""
            col_info.markdown(f"**{h.get('icon', '✨')} {h['title']}** <span class='badge-pill'>🔥 {streak}d</span>{desc_text}", unsafe_allow_html=True)

            if h["type"] == "numeric":
                new_val = col_val.number_input(
                    h.get("unit", "qty"),
                    value=int(h_val),
                    min_value=0,
                    step=1,
                    key=f"ov_num_{h['id']}_{selected_date_str}",
                    label_visibility="collapsed",
                )
                if new_val != h_val:
                    is_complete = new_val >= (h.get("targetValue") or 1)
                    set_habit_log(h["id"], selected_date_str, is_complete, new_val)
                    st.rerun()
            else:
                col_val.write("✅ Complete" if is_done else "⚪ Pending")

    with c_right:
        st.subheader("⏰ Daily Routine Timeline")
        if not routines:
            st.info("No routines scheduled. Add routine items in the Daily Routine tab.")
        for r in routines:
            is_done = r["id"] in completed_routines_list
            col_r_chk, col_r_info = st.columns([0.1, 0.9])
            r_checked = col_r_chk.checkbox("", value=is_done, key=f"ov_rchk_{r['id']}_{selected_date_str}")
            if r_checked != is_done:
                toggle_routine_item(r["id"], selected_date_str)
                st.rerun()
            
            note_str = f"<br/><small style='color: #64748b;'>{r['notes']}</small>" if r.get("notes") else ""
            col_r_info.markdown(
                f"<span class='phase-badge'>{r['phase']}</span> **{r['time']}** · {r['title']} *({r['durationMinutes']}m)*{note_str}",
                unsafe_allow_html=True,
            )

    st.markdown("---")

    # 3. Wellness & Reflection Section
    st.subheader("🧘 Daily Wellness & Reflection")
    wellness_data = tracker.get("wellness_logs", {}).get(selected_date_str, {})
    
    w_col1, w_col2, w_col3 = st.columns([1, 1, 2])
    
    with w_col1:
        current_mood = wellness_data.get("mood", "good")
        mood_options = ["great", "good", "neutral", "low", "bad"]
        mood_emojis = {"great": "😄 Great", "good": "🙂 Good", "neutral": "😐 Neutral", "low": "😔 Low", "bad": "😫 Bad"}
        selected_mood = st.selectbox(
            "Overall Mood",
            options=mood_options,
            format_func=lambda m: mood_emojis.get(m, m),
            index=mood_options.index(current_mood) if current_mood in mood_options else 1,
        )

        current_energy = int(wellness_data.get("energyLevel", 3))
        selected_energy = st.slider("Energy Level (1 - 5)", 1, 5, current_energy)

    with w_col2:
        current_sleep = float(wellness_data.get("sleepHours", 7.5))
        selected_sleep = st.number_input("Sleep Duration (Hours)", min_value=0.0, max_value=24.0, value=current_sleep, step=0.5)

        sleep_quality = wellness_data.get("sleepQuality", "restful")
        quality_options = ["restful", "average", "poor"]
        selected_quality = st.selectbox("Sleep Quality", quality_options, index=quality_options.index(sleep_quality) if sleep_quality in quality_options else 0)

    with w_col3:
        current_note = wellness_data.get("journalNote", "")
        selected_note = st.text_area("Daily Journal & Win / Reflection", value=current_note, placeholder="What went well today? What will you improve tomorrow?")

    if st.button("Save Daily Wellness & Reflection"):
        if "wellness_logs" not in tracker:
            tracker["wellness_logs"] = {}
        tracker["wellness_logs"][selected_date_str] = {
            "mood": selected_mood,
            "energyLevel": selected_energy,
            "sleepHours": selected_sleep,
            "sleepQuality": selected_quality,
            "journalNote": selected_note,
        }
        trigger_save()
        st.success("Wellness log updated!")

# =============================================================================
# VIEW 2: HABITS
# =============================================================================
elif nav_tab == "🎯 Habits":
    st.markdown("<div class='main-header'>Habit Formation & Streaks</div>", unsafe_allow_html=True)
    st.markdown("<div class='sub-header'>Build consistent daily habits, track streaks, and maintain long-term momentum.</div>", unsafe_allow_html=True)

    habits = tracker.get("habits", [])
    
    # 7-day rolling window for matrix view
    today_dt = active_date
    date_window = [today_dt - timedelta(days=i) for i in range(6, -1, -1)]

    # Weekly matrix header
    st.markdown("#### 📅 7-Day Habit Matrix")
    
    matrix_cols = st.columns([3] + [1] * 7 + [1.5])
    matrix_cols[0].markdown("**Habit Title**")
    for idx, d in enumerate(date_window):
        matrix_cols[idx + 1].markdown(f"**{d.strftime('%a')}**<br/><small>{d.strftime('%m/%d')}</small>", unsafe_allow_html=True)
    matrix_cols[-1].markdown("**Streak**")

    st.markdown("---")

    for h in habits:
        row_cols = st.columns([3] + [1] * 7 + [1.5])
        row_cols[0].markdown(f"**{h.get('icon', '✨')} {h['title']}**<br/><small style='color:#64748b;'>{h['category'].title()} · {h['type']}</small>", unsafe_allow_html=True)

        for idx, d in enumerate(date_window):
            d_str = d.isoformat()
            log = get_habit_log(h["id"], d_str)
            done = log.get("completed", False)
            btn_label = "✅" if done else "⚪"
            if row_cols[idx + 1].button(btn_label, key=f"mat_{h['id']}_{d_str}"):
                set_habit_log(h["id"], d_str, not done, h.get("targetValue") if not done else 0)
                st.rerun()

        streak = calculate_habit_streak(h["id"], selected_date_str)
        row_cols[-1].markdown(f"🔥 **{streak} days**")

    st.markdown("---")

    # Add New Habit Form
    with st.expander("➕ Create a New Habit", expanded=False):
        with st.form("create_habit_form"):
            f_col1, f_col2 = st.columns(2)
            new_title = f_col1.text_input("Habit Title *", placeholder="e.g. 20-min Cold Shower, Read 20 Pages")
            new_desc = f_col2.text_input("Intention / Rules", placeholder="e.g. Non-fiction books only, drink right away")

            c_col1, c_col2, c_col3 = st.columns(3)
            new_category = c_col1.selectbox("Category", ["health", "fitness", "mind", "productivity", "diet", "lifestyle"])
            new_type = c_col2.selectbox("Tracking Type", ["boolean", "numeric"])
            new_icon = c_col3.text_input("Emoji Icon", value="⚡")

            target_val = 1
            unit_val = ""
            if new_type == "numeric":
                n_col1, n_col2 = st.columns(2)
                target_val = n_col1.number_input("Target Number", min_value=1, value=15)
                unit_val = n_col2.text_input("Unit", value="mins")

            submit_habit = st.form_submit_button("Create Habit")
            if submit_habit:
                if not new_title.strip():
                    st.error("Please provide a valid habit title.")
                else:
                    new_id = f"habit-{int(datetime.now().timestamp())}"
                    tracker["habits"].append({
                        "id": new_id,
                        "title": new_title.strip(),
                        "description": new_desc.strip(),
                        "category": new_category,
                        "color": "emerald",
                        "icon": new_icon.strip() or "✨",
                        "frequency": "daily",
                        "type": new_type,
                        "targetValue": target_val if new_type == "numeric" else None,
                        "unit": unit_val.strip() if new_type == "numeric" else None,
                        "createdAt": date.today().isoformat(),
                    })
                    trigger_save()
                    st.success(f"Habit '{new_title}' created!")
                    st.rerun()

    # Manage / Delete Habits
    with st.expander("🗑️ Manage / Remove Habits", expanded=False):
        if habits:
            habit_titles = {h["id"]: h["title"] for h in habits}
            delete_id = st.selectbox("Select Habit to Delete", list(habit_titles.keys()), format_func=lambda x: habit_titles[x])
            if st.button("Delete Selected Habit", type="primary"):
                tracker["habits"] = [h for h in tracker["habits"] if h["id"] != delete_id]
                trigger_save()
                st.success("Habit removed.")
                st.rerun()

# =============================================================================
# VIEW 3: DAILY ROUTINE
# =============================================================================
elif nav_tab == "⏰ Daily Routine":
    st.markdown("<div class='main-header'>Daily Routine & Time-Blocking</div>", unsafe_allow_html=True)
    st.markdown(f"<div class='sub-header'>Phased routine timeline for {active_date.strftime('%A, %B %d, %Y')}</div>", unsafe_allow_html=True)

    routines = tracker.get("routines", [])
    completed_routines_list = get_completed_routines(selected_date_str)

    # Group by phase
    phases = ["morning", "afternoon", "evening", "night"]
    phase_titles = {
        "morning": "🌅 Morning Phase (05:00 - 11:59)",
        "afternoon": "☀️ Afternoon Phase (12:00 - 17:59)",
        "evening": "🌆 Evening Phase (18:00 - 21:59)",
        "night": "🌙 Night Phase (22:00 - 04:59)",
    }

    for p in phases:
        phase_items = [r for r in routines if r.get("phase") == p]
        st.markdown(f"#### {phase_titles[p]}")
        if not phase_items:
            st.caption("No routine items configured for this phase.")
        else:
            for r in phase_items:
                is_done = r["id"] in completed_routines_list
                col_chk, col_details, col_time = st.columns([0.1, 0.7, 0.2])
                
                checked = col_chk.checkbox("", value=is_done, key=f"r_chk_{r['id']}_{selected_date_str}")
                if checked != is_done:
                    toggle_routine_item(r["id"], selected_date_str)
                    st.rerun()

                st_text = f"~~{r['title']}~~" if is_done else f"**{r['title']}**"
                note_text = f"<br/><span style='color:#64748b; font-size: 0.85rem;'>{r['notes']}</span>" if r.get("notes") else ""
                col_details.markdown(f"{st_text} <span class='badge-pill'>{r.get('category', 'Routine')}</span>{note_text}", unsafe_allow_html=True)

                col_time.markdown(f"⏱️ **{r['time']}** ({r['durationMinutes']}m)")
        st.markdown("---")

    # Add Routine Item Form
    with st.expander("➕ Add Routine Item", expanded=False):
        with st.form("create_routine_form"):
            r_col1, r_col2 = st.columns(2)
            r_title = r_col1.text_input("Routine Milestone *", placeholder="e.g. Wim Hof Breathing & Cold Shower")
            r_phase = r_col2.selectbox("Day Phase", ["morning", "afternoon", "evening", "night"])

            t_col1, t_col2, t_col3 = st.columns(3)
            r_time = t_col1.text_input("Target Time", value="08:00")
            r_duration = t_col2.number_input("Duration (minutes)", min_value=1, max_value=360, value=20)
            r_category = t_col3.selectbox("Category", ["Health", "Fitness", "Productivity", "Mind", "Diet", "Lifestyle"])

            r_notes = st.text_input("Instructions / Context", placeholder="e.g. Sip 500ml water, do 3 rounds of breathing")

            submit_routine = st.form_submit_button("Add to Routine")
            if submit_routine:
                if not r_title.strip():
                    st.error("Please enter a routine title.")
                else:
                    new_r_id = f"routine-{int(datetime.now().timestamp())}"
                    tracker["routines"].append({
                        "id": new_r_id,
                        "title": r_title.strip(),
                        "phase": r_phase,
                        "time": r_time.strip(),
                        "durationMinutes": int(r_duration),
                        "category": r_category,
                        "notes": r_notes.strip() or None,
                    })
                    trigger_save()
                    st.success(f"Added '{r_title}' to routine!")
                    st.rerun()

    # Manage / Delete Routine
    with st.expander("🗑️ Remove a Routine Item", expanded=False):
        if routines:
            r_titles = {r["id"]: f"{r['time']} - {r['title']} ({r['phase']})" for r in routines}
            del_r_id = st.selectbox("Select Routine to Delete", list(r_titles.keys()), format_func=lambda x: r_titles[x])
            if st.button("Delete Selected Routine", type="primary"):
                tracker["routines"] = [r for r in tracker["routines"] if r["id"] != del_r_id]
                trigger_save()
                st.success("Routine milestone removed.")
                st.rerun()

# =============================================================================
# VIEW 4: DIET & MACROS
# =============================================================================
elif nav_tab == "🥗 Diet & Macros":
    st.markdown("<div class='main-header'>Diet, Macros & Hydration</div>", unsafe_allow_html=True)
    st.markdown(f"<div class='sub-header'>Nutrition breakdown and calorie targets for {active_date.strftime('%A, %B %d, %Y')}</div>", unsafe_allow_html=True)

    diet_data = get_diet_for_date(selected_date_str)
    nutrition = get_nutrition_summary(selected_date_str)
    goals = tracker.get("goals", DEFAULT_GOALS)

    # 1. Macro KPI Progress Cards
    m_col1, m_col2, m_col3, m_col4 = st.columns(4)
    cal_rem = goals["calorieTarget"] - nutrition["calories"]
    m_col1.metric("Calories", f"{nutrition['calories']} kcal", f"{cal_rem} kcal remaining" if cal_rem >= 0 else f"{abs(cal_rem)} kcal over")
    m_col1.progress(min(1.0, nutrition["calories"] / goals["calorieTarget"]) if goals["calorieTarget"] > 0 else 0.0)

    p_rem = goals["proteinTarget"] - nutrition["protein"]
    m_col2.metric("Protein", f"{nutrition['protein']} g", f"Target: {goals['proteinTarget']}g")
    m_col2.progress(min(1.0, nutrition["protein"] / goals["proteinTarget"]) if goals["proteinTarget"] > 0 else 0.0)

    c_rem = goals["carbsTarget"] - nutrition["carbs"]
    m_col3.metric("Carbohydrates", f"{nutrition['carbs']} g", f"Target: {goals['carbsTarget']}g")
    m_col3.progress(min(1.0, nutrition["carbs"] / goals["carbsTarget"]) if goals["carbsTarget"] > 0 else 0.0)

    f_rem = goals["fatTarget"] - nutrition["fat"]
    m_col4.metric("Healthy Fats", f"{nutrition['fat']} g", f"Target: {goals['fatTarget']}g")
    m_col4.progress(min(1.0, nutrition["fat"] / goals["fatTarget"]) if goals["fatTarget"] > 0 else 0.0)

    st.markdown("---")

    # 2. Hydration Section
    st.subheader("💧 Hydration Tracker")
    current_water = diet_data.get("waterIntakeMl", 0)
    w_target = goals.get("waterTargetMl", 2800)
    w_pct = min(100, int((current_water / w_target) * 100)) if w_target > 0 else 0

    st.write(f"Logged Water: **{current_water} ml** / {w_target} ml ({w_pct}% satisfied)")
    st.progress(w_pct / 100.0)

    w_btn1, w_btn2, w_btn3, w_btn4 = st.columns([1, 1, 1, 3])
    if w_btn1.button("+250 ml (Cup)"):
        if "diet_logs" not in tracker:
            tracker["diet_logs"] = {}
        if selected_date_str not in tracker["diet_logs"]:
            tracker["diet_logs"][selected_date_str] = {"waterIntakeMl": 0, "meals": []}
        tracker["diet_logs"][selected_date_str]["waterIntakeMl"] = current_water + 250
        trigger_save()
        st.rerun()

    if w_btn2.button("+500 ml (Bottle)"):
        if "diet_logs" not in tracker:
            tracker["diet_logs"] = {}
        if selected_date_str not in tracker["diet_logs"]:
            tracker["diet_logs"][selected_date_str] = {"waterIntakeMl": 0, "meals": []}
        tracker["diet_logs"][selected_date_str]["waterIntakeMl"] = current_water + 500
        trigger_save()
        st.rerun()

    if w_btn3.button("Reset Water"):
        if selected_date_str in tracker.get("diet_logs", {}):
            tracker["diet_logs"][selected_date_str]["waterIntakeMl"] = 0
            trigger_save()
            st.rerun()

    st.markdown("---")

    # 3. Logged Meals Table
    st.subheader("🍽️ Meals Logged for Today")
    meals = diet_data.get("meals", [])
    if not meals:
        st.info("No meals logged yet for this date. Use the quick logger below.")
    else:
        for m in meals:
            m_col_info, m_col_nutr, m_col_del = st.columns([0.5, 0.4, 0.1])
            m_col_info.markdown(f"<span class='badge-pill'>{m['mealType'].upper()}</span> **{m['name']}** *({m.get('time', '')})*", unsafe_allow_html=True)
            m_col_nutr.markdown(f"🔥 **{m['calories']}** kcal · **{m['protein']}g** P · **{m['carbs']}g** C · **{m['fat']}g** F")
            if m_col_del.button("❌", key=f"del_meal_{m['id']}"):
                diet_data["meals"] = [meal for meal in diet_data["meals"] if meal["id"] != m["id"]]
                trigger_save()
                st.rerun()

    st.markdown("---")

    # 4. Quick Preset Food Logger
    with st.expander("⚡ Quick Log From Preset Library", expanded=True):
        preset_names = [f"{p['name']} ({p['cal']} kcal | {p['p']}g P)" for p in FOOD_PRESETS]
        selected_idx = st.selectbox("Choose Wholesome Preset", range(len(preset_names)), format_func=lambda i: preset_names[i])
        preset = FOOD_PRESETS[selected_idx]
        
        c_slot, c_add = st.columns([2, 1])
        target_slot = c_slot.selectbox("Meal Category", ["breakfast", "lunch", "dinner", "snack"], index=["breakfast", "lunch", "dinner", "snack"].index(preset["type"]))
        if c_add.button("Log Preset Meal"):
            if "diet_logs" not in tracker:
                tracker["diet_logs"] = {}
            if selected_date_str not in tracker["diet_logs"]:
                tracker["diet_logs"][selected_date_str] = {"waterIntakeMl": 0, "meals": []}
            
            new_meal_id = f"meal-{int(datetime.now().timestamp())}"
            tracker["diet_logs"][selected_date_str]["meals"].append({
                "id": new_meal_id,
                "mealType": target_slot,
                "name": preset["name"],
                "calories": preset["cal"],
                "protein": preset["p"],
                "carbs": preset["c"],
                "fat": preset["f"],
                "time": datetime.now().strftime("%H:%M"),
            })
            trigger_save()
            st.success(f"Logged {preset['name']} to {target_slot.title()}!")
            st.rerun()

    # 5. Custom Meal Logger Form
    with st.expander("➕ Log Custom Dish / Food", expanded=False):
        with st.form("custom_meal_form"):
            c_name = st.text_input("Meal / Dish Name *", placeholder="e.g. Steak & Sweet Potato, Protein Smoothie")
            c_type = st.selectbox("Meal Slot", ["breakfast", "lunch", "dinner", "snack"])
            
            mc1, mc2, mc3, mc4 = st.columns(4)
            c_cal = mc1.number_input("Calories (kcal)", min_value=0, max_value=5000, value=450)
            c_p = mc2.number_input("Protein (g)", min_value=0, max_value=500, value=30)
            c_c = mc3.number_input("Carbs (g)", min_value=0, max_value=500, value=40)
            c_f = mc4.number_input("Fat (g)", min_value=0, max_value=500, value=12)

            submit_meal = st.form_submit_button("Log Custom Meal")
            if submit_meal:
                if not c_name.strip():
                    st.error("Please enter a meal name.")
                else:
                    if "diet_logs" not in tracker:
                        tracker["diet_logs"] = {}
                    if selected_date_str not in tracker["diet_logs"]:
                        tracker["diet_logs"][selected_date_str] = {"waterIntakeMl": 0, "meals": []}

                    tracker["diet_logs"][selected_date_str]["meals"].append({
                        "id": f"meal-{int(datetime.now().timestamp())}",
                        "mealType": c_type,
                        "name": c_name.strip(),
                        "calories": int(c_cal),
                        "protein": int(c_p),
                        "carbs": int(c_c),
                        "fat": int(c_f),
                        "time": datetime.now().strftime("%H:%M"),
                    })
                    trigger_save()
                    st.success(f"Logged {c_name}!")
                    st.rerun()

# =============================================================================
# VIEW 5: ANALYTICS & TRENDS
# =============================================================================
elif nav_tab == "📈 Analytics":
    st.markdown("<div class='main-header'>Performance Analytics & Consistency</div>", unsafe_allow_html=True)
    st.markdown("<div class='sub-header'>14-day execution trends, macro distribution, and habit reliability</div>", unsafe_allow_html=True)

    # Compile 14-day history
    today_dt = active_date
    history_dates = [(today_dt - timedelta(days=i)) for i in range(13, -1, -1)]
    
    records = []
    habits = tracker.get("habits", [])
    total_h_count = len(habits) or 1

    for d in history_dates:
        d_str = d.isoformat()
        comp_h = sum(1 for h in habits if get_habit_log(h["id"], d_str).get("completed", False))
        comp_r = len(get_completed_routines(d_str))
        nutr = get_nutrition_summary(d_str)
        water = get_diet_for_date(d_str).get("waterIntakeMl", 0)

        records.append({
            "Date": d.strftime("%m/%d"),
            "Habits Completed": comp_h,
            "Habit Adherence %": int(comp_h / total_h_count * 100),
            "Routines Done": comp_r,
            "Calories": nutr["calories"],
            "Water (L)": round(water / 1000.0, 2),
        })

    df_history = pd.DataFrame(records)

    st.subheader("📊 14-Day Habit Adherence Velocity")
    st.bar_chart(df_history.set_index("Date")[["Habit Adherence %"]])

    st.markdown("---")

    col_chart1, col_chart2 = st.columns(2)
    with col_chart1:
        st.subheader("🔥 Calorie History (kcal)")
        st.line_chart(df_history.set_index("Date")[["Calories"]])
    
    with col_chart2:
        st.subheader("💧 Hydration History (Liters)")
        st.line_chart(df_history.set_index("Date")[["Water (L)"]])

    st.markdown("---")

    # Habit reliability leaderboard
    st.subheader("🏆 Habit Reliability Leaderboard")
    leaderboard = []
    for h in habits:
        completions_14d = sum(1 for d in history_dates if get_habit_log(h["id"], d.isoformat()).get("completed", False))
        rate = int((completions_14d / len(history_dates)) * 100)
        curr_streak = calculate_habit_streak(h["id"], selected_date_str)
        leaderboard.append({
            "Habit": f"{h.get('icon', '✨')} {h['title']}",
            "Category": h["category"].title(),
            "Current Streak": f"{curr_streak} days",
            "14-Day Consistency": f"{rate}% ({completions_14d}/14)",
            "Score": completions_14d,
        })

    leaderboard.sort(key=lambda x: x["Score"], reverse=True)
    df_lb = pd.DataFrame(leaderboard).drop(columns=["Score"])
    st.dataframe(df_lb, use_container_width=True)

# =============================================================================
# VIEW 6: SETTINGS & BACKUP
# =============================================================================
elif nav_tab == "⚙️ Settings & Backup":
    st.markdown("<div class='main-header'>Settings & Data Management</div>", unsafe_allow_html=True)
    st.markdown("<div class='sub-header'>Configure your personal targets, export backups, or restore data.</div>", unsafe_allow_html=True)

    goals = tracker.get("goals", DEFAULT_GOALS)

    with st.form("settings_goals_form"):
        st.subheader("🎯 Personal Nutritional & Hydration Targets")
        c_g1, c_g2 = st.columns(2)
        new_cal_target = c_g1.number_input("Daily Calorie Target (kcal)", min_value=500, max_value=10000, value=int(goals.get("calorieTarget", 2150)))
        new_water_target = c_g2.number_input("Daily Water Target (ml)", min_value=500, max_value=10000, step=100, value=int(goals.get("waterTargetMl", 2800)))

        m_g1, m_g2, m_g3 = st.columns(3)
        new_p_target = m_g1.number_input("Protein Target (g)", min_value=10, max_value=500, value=int(goals.get("proteinTarget", 140)))
        new_c_target = m_g2.number_input("Carbs Target (g)", min_value=10, max_value=800, value=int(goals.get("carbsTarget", 220)))
        new_f_target = m_g3.number_input("Fat Target (g)", min_value=5, max_value=300, value=int(goals.get("fatTarget", 65)))

        save_goals_btn = st.form_submit_button("Update Daily Targets")
        if save_goals_btn:
            tracker["goals"] = {
                "calorieTarget": int(new_cal_target),
                "proteinTarget": int(new_p_target),
                "carbsTarget": int(new_c_target),
                "fatTarget": int(new_f_target),
                "waterTargetMl": int(new_water_target),
                "dailySleepTargetHours": float(goals.get("dailySleepTargetHours", 8.0)),
            }
            trigger_save()
            st.success("Daily targets updated successfully!")

    st.markdown("---")

    # Export and Import Data
    st.subheader("💾 Backup & Restore")
    exp_col, imp_col = st.columns(2)

    with exp_col:
        st.markdown("#### 📥 Export JSON Backup")
        st.caption("Download all habits, routines, meal records, and wellness history as a portable JSON file.")
        json_str = json.dumps(tracker, indent=2)
        st.download_button(
            label="Download JSON Backup File",
            data=json_str,
            file_name=f"habit_tracker_backup_{date.today().isoformat()}.json",
            mime="application/json",
        )

    with imp_col:
        st.markdown("#### 📤 Import JSON Backup")
        st.caption("Restore previously exported backup data.")
        uploaded_file = st.file_uploader("Upload JSON Backup File", type=["json"])
        if uploaded_file is not None:
            try:
                imported_data = json.load(uploaded_file)
                if st.button("Apply and Restore Uploaded Data", type="primary"):
                    st.session_state["tracker_data"] = imported_data
                    save_data(imported_data)
                    st.success("Data successfully restored from backup!")
                    st.rerun()
            except Exception as e:
                st.error(f"Error parsing JSON: {e}")

    st.markdown("---")
    
    st.subheader("🔄 Reset to Starter Sample Data")
    if st.button("Reset All Data to Default Starter Habits", type="secondary"):
        default_data = get_default_dataset()
        st.session_state["tracker_data"] = default_data
        save_data(default_data)
        st.success("All data has been reset to defaults.")
        st.rerun()
