import { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, Bell, CalendarDays, Check, ChefHat, ChevronDown, Clock3, Coffee, Flame, LogOut, MessageSquare, Plus, Salad, Send, ShieldCheck, Sparkles, Star, ThumbsDown, ThumbsUp, Utensils, X, Moon, Sun } from 'lucide-react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const mealOrder = ['Breakfast', 'Lunch', 'Dinner']
const mealIcons = { Breakfast: Coffee, Lunch: Utensils, Dinner: Salad }
const foodPhotos = {
	biryani: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=85',
	biriyani: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=85',
	pizza: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85',
	salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
	idly: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85',
	dosa: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=85',
	paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85',
	chicken: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85',
	breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=85',
	lunch: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
	dinner: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85'
}
function foodPhoto(menu) { if (menu.imageUrl) return menu.imageUrl; const text = (menu.items || []).join(' ').toLowerCase(); const match = Object.keys(foodPhotos).find(keyword => text.includes(keyword)); return foodPhotos[match || menu.mealType?.toLowerCase() || 'dinner']; }
async function api(path, options = {}, token) { const response = await fetch(`${API_URL}${path}`, { cache: 'no-store', ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } }); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.message || 'Something went wrong'); return body }

function App() { const [session, setSession] = useState(() => JSON.parse(sessionStorage.getItem('messmate-session') || 'null')); const [authMode, setAuthMode] = useState('login'); const logout = () => { sessionStorage.removeItem('messmate-session'); setSession(null) }; const onAuth = data => { sessionStorage.setItem('messmate-session', JSON.stringify(data)); setSession(data) }; return session ? <ShellContent session={session} onLogout={logout} /> : <OldAuthScreen mode={authMode} setMode={setAuthMode} onAuth={onAuth} /> }

function OldAuthScreen({ mode, setMode, onAuth }) { const [form, setForm] = useState({ name: '', email: '', password: '' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const submit = async event => { event.preventDefault(); setBusy(true); setError(''); try { onAuth(await api(`/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: JSON.stringify(form) })) } catch (err) { setError(err.message) } finally { setBusy(false) } }; return <main className="auth-page"><div className="auth-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-copy"><span className="eyebrow"><Sparkles size={14}/> HOSTEL DINING, REIMAGINED</span><h1>Good food<br/><em>starts with</em> a voice.</h1><p>One shared table for better menus, clearer feedback, and a mess that listens.</p><div className="art-stat"><strong>4.8</strong><span><span className="stars">★★★★★</span><br/>average student rating</span></div></div><div className="floating-plate"><span>Today at the mess</span><strong>Paneer tikka<br/>+ garlic naan</strong><small><Flame size={13}/> 86% students want it</small></div></div><section className="auth-panel"><div className="brand"><span className="brand-mark"><ChefHat size={20}/></span><span>mess<span>mate</span></span></div><div className="auth-heading"><span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'JOIN THE TABLE'}</span><h2>{mode === 'login' ? 'Let us feed your day.' : 'Make your meal matter.'}</h2><p>{mode === 'login' ? 'Sign in to see what is cooking.' : 'Create your student account in a minute.'}</p></div><form onSubmit={submit} className="auth-form">{mode === 'register' && <label>Full name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Aarav Sharma"/></label>}<label>Email address<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@hostel.edu"/></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters"/></label>{error && <div className="form-error"><X size={16}/> {error}</div>}<button className="primary-button" disabled={busy}>{busy ? 'Checking...' : mode === 'login' ? 'Enter MessMate' : 'Create student account'} <ArrowRight size={17}/></button></form><p className="auth-switch">{mode === 'login' ? 'New to MessMate?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></p><div className="auth-note"><ShieldCheck size={16}/> Your password is securely encrypted.</div></section></main> }

function OriginalShell({ session, onLogout }) { const [tab, setTab] = useState(session.user.role === 'admin' ? 'overview' : 'today'); const [notice, setNotice] = useState(''); const notify = message => { setNotice(message); window.setTimeout(() => setNotice(''), 3500) }; return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark"><ChefHat size={20}/></span><span>mess<span>mate</span></span></div><div className="profile"><div className="avatar">{session.user.name[0]}</div><div><strong>{session.user.name}</strong><small>{session.user.role === 'admin' ? 'Mess administrator' : 'Student resident'}</small></div><ChevronDown size={15}/></div><nav>{session.user.role === 'admin' ? <><NavItem icon={BarChart3} label="Overview" active={tab === 'overview'} onClick={() => setTab('overview')}/><NavItem icon={Utensils} label="Menu studio" active={tab === 'menus'} onClick={() => setTab('menus')}/><NavItem icon={MessageSquare} label="Feedback" active={tab === 'feedback'} onClick={() => setTab('feedback')}/></> : <><NavItem icon={Utensils} label="Today's menu" active={tab === 'today'} onClick={() => setTab('today')}/><NavItem icon={Clock3} label="My activity" active={tab === 'activity'} onClick={() => setTab('activity')}/></>}</nav><div className="sidebar-bottom"><div className="side-tip"><Sparkles size={17}/><p><strong>Small choices.</strong><br/>Better meals for everyone.</p></div><button className="logout" onClick={onLogout}><LogOut size={17}/> Sign out</button></div></aside><main className="main-content"><header className="topbar"><div><span className="date-label">THURSDAY, 01 OCTOBER 2026</span><h1>{session.user.role === 'admin' ? tab === 'overview' ? 'Good morning, admin.' : tab === 'menus' ? 'Menu studio' : 'The student voice' : tab === 'today' ? 'What are you hungry for?' : 'Your meal diary'}</h1></div><div className="top-actions"><button className="icon-button" title="Notifications"><Bell size={19}/><i/></button><div className="mini-avatar">{session.user.name[0]}</div></div></header>{session.user.role === 'admin' ? <OriginalAdminView tab={tab} token={session.token} notify={notify}/> : <OriginalStudentView tab={tab} token={session.token} notify={notify}/>}</main>{notice && <div className="toast"><Check size={17}/> {notice}</div>}</div> }
function NavItem({ icon: Icon, label, active, onClick }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}><Icon size={18}/> {label}{active && <span className="nav-dot"/>}</button> }

function LegacyPollingMenuView({ tab, token, notify }) { const [menus, setMenus] = useState([]); const [votes, setVotes] = useState([]); const [feedbackMenu, setFeedbackMenu] = useState(null); const [loading, setLoading] = useState(true); const refresh = async () => { try { const [published, mine] = await Promise.all([api('/menus', {}, token), api('/votes/mine', {}, token)]); setMenus(published); setVotes(mine) } catch { notify('Could not load the menu. Is the API running?') } finally { setLoading(false) } }; useEffect(() => { refresh() }, []); const vote = async (menuId, choice) => { try { await api('/votes', { method:'POST', body:JSON.stringify({ menuId, vote:choice }) }, token); notify('Your vote has been recorded'); refresh() } catch (err) { notify(err.message) } }; if (tab === 'activity') return <section className="content-area"><div className="section-intro"><span className="eyebrow">YOUR HISTORY</span><h2>Every choice counts.</h2><p>Votes and feedback you have shared with the mess.</p></div><div className="activity-list">{votes.length ? votes.map(v => <div className="activity-row" key={v._id}><span className="activity-icon"><Check size={16}/></span><div><strong>Vote submitted</strong><small>{v.vote === 'want' ? 'You want this meal' : 'You would skip this meal'}</small></div><time>{new Date(v.createdAt).toLocaleDateString()}</time></div>) : <EmptyState text="Your voting history will appear here."/>}</div></section>; const grouped = mealOrder.map(type => ({ type, menu:menus.find(menu => menu.mealType?.toLowerCase() === type.toLowerCase()) })).filter(item => item.menu); return <section className="content-area"><div className="hero-banner"><div><span className="eyebrow light">TOMORROW'S TABLE</span><h2>A menu made<br/>for your mood.</h2><p>Cast your vote before the kitchen starts.</p></div><div className="banner-plate"><Utensils size={62} strokeWidth={1.2}/></div></div><div className="section-heading"><div><span className="eyebrow">VOTE YOUR PLATE</span><h2>What sounds good?</h2></div><span className="muted">{grouped.length} meals available</span></div>{loading ? <div className="loading-line">Loading today's menu...</div> : <div className="meal-grid">{grouped.length ? grouped.map(({ type, menu }) => <VeryOldMealCard key={menu._id} type={type} menu={menu} vote={votes.find(v => v.menuId === menu._id)} onVote={vote} onFeedback={() => setFeedbackMenu(menu)}/>) : <EmptyState text="The admin has not published a menu yet."/>}</div>}{feedbackMenu && <FeedbackModal menu={feedbackMenu} token={token} onClose={() => setFeedbackMenu(null)} notify={notify}/>}</section> }
function VeryOldMealCard({ type, menu, vote, onVote, onFeedback }) { const Icon = mealIcons[type]; return <article className="meal-card"><div className="meal-top"><span className={`meal-icon ${type.toLowerCase()}`}><Icon size={21}/></span><span className="meal-time">{type}</span>{menu.served && <span className="served-tag"><Check size={12}/> served</span>}</div><h3>{menu.items?.join(' + ') || 'Menu coming soon'}</h3><p>{menu.description || 'Prepared fresh by the mess kitchen.'}</p><div className="meal-footer">{menu.served ? <button className="feedback-link" onClick={onFeedback}><Star size={15}/> Rate this meal</button> : <div className="vote-buttons"><button className={vote?.vote === 'want' ? 'chosen want' : ''} onClick={() => onVote(menu._id,'want')}><ThumbsUp size={15}/> Want</button><button className={vote?.vote === 'dont-want' ? 'chosen skip' : ''} onClick={() => onVote(menu._id,'dont-want')}><ThumbsDown size={15}/> Skip</button></div>}{vote && <span className="voted-label"><Check size={13}/> voted</span>}</div></article> }

function FeedbackModal({ menu, token, onClose, notify }) { const [scores, setScores] = useState({ taste:0, quality:0, quantity:0, cleanliness:0, overallRating:0 }); const [comment, setComment] = useState(''); const [busy, setBusy] = useState(false); const submit = async e => { e.preventDefault(); if (Object.values(scores).some(score => !score)) return notify('Please rate every category'); setBusy(true); try { await api('/feedback', { method:'POST', body:JSON.stringify({ menuId:menu._id, ...scores, comment }) }, token); notify('Thanks for helping improve the mess'); onClose() } catch (err) { notify(err.message) } finally { setBusy(false) } }; return <div className="modal-backdrop"><form className="feedback-modal" onSubmit={submit}><button type="button" className="close-button" onClick={onClose}><X size={18}/></button><span className="eyebrow">AFTER THE MEAL</span><h2>How was your {menu.mealType.toLowerCase()}?</h2><p className="modal-meal">{menu.items?.join(' + ')}</p><div className="rating-list">{[['taste','Taste'],['quality','Food quality'],['quantity','Quantity'],['cleanliness','Cleanliness'],['overallRating','Overall rating']].map(([key,label]) => <div className="rating-row" key={key}><span>{label}</span><div className="stars-input">{[1,2,3,4,5].map(value => <button type="button" key={value} className={scores[key] >= value ? 'selected' : ''} onClick={() => setScores({ ...scores, [key]:value })}><Star size={20} fill="currentColor"/></button>)}</div></div>)}</div><textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Tell the kitchen what stood out..."/><button className="primary-button" disabled={busy}>{busy ? 'Sending...' : 'Submit feedback'} <Send size={16}/></button></form></div> }

function BaseAdminView({ tab, token, notify }) { const [data, setData] = useState({ menus:[], votes:[], feedback:[], averages:{} }); const [showForm, setShowForm] = useState(false); const [form, setForm] = useState({ date:'', mealType:'Breakfast', items:'', description:'' }); const refresh = async () => { try { setData(await api('/admin/overview', {}, token)) } catch { notify('Could not load admin overview') } }; useEffect(() => { refresh() }, []); const create = async e => { e.preventDefault(); try { await api('/menus', { method:'POST', body:JSON.stringify({ ...form, items:form.items.split(',').map(item => item.trim()).filter(Boolean) }) }, token); setShowForm(false); setForm({ date:'', mealType:'Breakfast', items:'', description:'' }); notify('Draft menu created'); refresh() } catch (err) { notify(err.message) } }; const action = async (id,type) => { try { await api(`/menus/${id}/${type}`, { method:'PATCH' }, token); notify(type === 'publish' ? 'Menu published for students' : 'Meal marked as served'); refresh() } catch (err) { notify(err.message) } }; if (tab === 'menus') return <section className="content-area"><div className="section-heading"><div><span className="eyebrow">MENU STUDIO</span><h2>Shape tomorrow's table.</h2></div><button className="primary-button compact" onClick={() => setShowForm(true)}><Plus size={16}/> Add meal</button></div><div className="admin-menu-list">{data.menus.map(menu => <div className="admin-menu-row" key={menu._id}><span className={`meal-icon ${menu.mealType?.toLowerCase()}`}>{(() => { const Icon = mealIcons[menu.mealType]; return Icon ? <Icon size={19}/> : <Utensils size={19}/> })()}</span><div className="admin-menu-info"><strong>{menu.mealType}</strong><span>{menu.items?.join(' + ')}</span></div><span className={`status ${menu.status}`}>{menu.status}</span>{menu.status === 'draft' && <button className="text-button" onClick={() => action(menu._id,'publish')}>Publish <ArrowRight size={14}/></button>}{menu.status === 'published' && !menu.served && <button className="text-button" onClick={() => action(menu._id,'served')}>Mark served <Check size={14}/></button>}</div>)}{!data.menus.length && <EmptyState text="Create your first meal to start tomorrow's menu."/>}</div>{showForm && <div className="modal-backdrop"><form className="feedback-modal create-form" onSubmit={create}><button type="button" className="close-button" onClick={() => setShowForm(false)}><X size={18}/></button><span className="eyebrow">NEW MENU ITEM</span><h2>Add a meal</h2><label>Date<input required type="date" value={form.date} onChange={e => setForm({ ...form, date:e.target.value })}/></label><label>Meal<select value={form.mealType} onChange={e => setForm({ ...form, mealType:e.target.value })}>{mealOrder.map(meal => <option key={meal}>{meal}</option>)}</select></label><label>Items <small>Separate with commas</small><input required value={form.items} onChange={e => setForm({ ...form, items:e.target.value })} placeholder="Idli, vada, sambar"/></label><label>Kitchen note<textarea value={form.description} onChange={e => setForm({ ...form, description:e.target.value })} placeholder="A little note for students..."/></label><button className="primary-button">Save draft <Check size={16}/></button></form></div>}</section>; if (tab === 'feedback') return <section className="content-area"><div className="section-intro"><span className="eyebrow">LISTEN CLOSELY</span><h2>The student voice.</h2><p>Patterns from every plate served.</p></div><div className="metrics-row">{[['overallRating','Overall'],['taste','Taste'],['quality','Quality'],['quantity','Quantity'],['cleanliness','Cleanliness']].map(([key,label]) => <div className="metric" key={key}><span>{label}</span><strong>{data.averages[key] || '0.0'}<small>/5</small></strong><div className="metric-stars">★★★★★</div></div>)}</div><div className="comments-panel"><div className="panel-heading"><h3>Recent comments</h3><span>{data.feedback.length} notes</span></div>{data.feedback.map(item => <div className="comment-row" key={item._id}><span className="comment-star"><Star size={15} fill="currentColor"/></span><p>{item.comment || 'No written comment.'}</p><time>{new Date(item.createdAt).toLocaleDateString()}</time></div>)}{!data.feedback.length && <EmptyState text="Student feedback will appear after meals are served."/>}</div></section>; const published = data.menus.filter(menu => menu.status === 'published'); const totalVotes = data.votes.reduce((sum,item) => sum + item.count,0); return <section className="content-area"><div className="admin-hero"><div><span className="eyebrow light">MESSMATE PULSE</span><h2>Small data.<br/><em>Better decisions.</em></h2><p>See what your residents want before the kitchen opens.</p></div><div className="pulse-number"><strong>{totalVotes}</strong><span>votes collected<br/>this cycle</span></div></div><div className="section-heading"><div><span className="eyebrow">AT A GLANCE</span><h2>Today's pulse</h2></div><span className="muted">Live overview</span></div><div className="dashboard-grid"><div className="chart-panel"><div className="panel-heading"><h3>Meal participation</h3><BarChart3 size={18}/></div>{published.length ? published.map(menu => { const want = data.votes.find(v => String(v._id.menuId) === String(menu._id) && v._id.vote === 'want')?.count || 0; const skip = data.votes.find(v => String(v._id.menuId) === String(menu._id) && v._id.vote === 'dont-want')?.count || 0; const max = Math.max(want + skip,1); return <div className="bar-row" key={menu._id}><div><span>{menu.mealType}</span><small>{want} want / {skip} skip</small></div><div className="bar-track"><i style={{ width:`${want / max * 100}%` }}/></div></div> }) : <EmptyState text="Publish meals to see voting data."/>}</div><div className="quick-panel"><div className="panel-heading"><h3>Kitchen checklist</h3><ChefHat size={18}/></div>{[['Publish tomorrow menu',published.length > 0],['Collect student votes',totalVotes > 0],['Review meal feedback',data.feedback.length > 0]].map(([label,done]) => <div className="check-row" key={label}><span className={done ? 'done' : ''}>{done ? <Check size={14}/> : <Clock3 size={14}/>}</span><p>{label}</p></div>)}</div></div></section> }
function EmptyState({ text }) { return <div className="empty-state"><Utensils size={22}/><p>{text}</p></div> }
function LegacyAuthScreen({ mode, setMode, onAuth }) {
	const [form, setForm] = useState({ name: '', email: '', password: '' });
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [busy, setBusy] = useState(false);

	const submit = async (event) => {
		event.preventDefault();
		setBusy(true);
		setError('');
		setSuccess('');
		try {
			const result = await api(`/auth/${mode === 'login' ? 'login' : 'register'}`, {
				method: 'POST',
				body: JSON.stringify(form),
			});
			if (mode === 'login') {
				onAuth(result);
			} else {
				setForm({ name: '', email: form.email, password: '' });
				setMode('login');
				setSuccess('Account created. Sign in to continue.');
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setBusy(false);
		}
	};

	const switchMode = () => {
		setMode(mode === 'login' ? 'register' : 'login');
		setError('');
		setSuccess('');
	};

	return <main className="auth-page"><div className="auth-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-copy"><span className="eyebrow"><Sparkles size={14}/> HOSTEL DINING, REIMAGINED</span><h1>Good food<br/><em>starts with</em> a voice.</h1><p>One shared table for better menus, clearer feedback, and a mess that listens.</p><div className="art-stat"><strong>4.8</strong><span><span className="stars">*****</span><br/>average student rating</span></div></div><div className="floating-plate"><span>Today at the mess</span><strong>Paneer tikka<br/>+ garlic naan</strong><small><Flame size={13}/> 86% students want it</small></div></div><section className="auth-panel"><div className="brand"><span className="brand-mark"><ChefHat size={20}/></span><span>mess<span>mate</span></span></div><div className="auth-heading"><span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'JOIN THE TABLE'}</span><h2>{mode === 'login' ? 'Let us feed your day.' : 'Make your meal matter.'}</h2><p>{mode === 'login' ? 'Sign in to see what is cooking.' : 'Create your student account in a minute.'}</p></div><form onSubmit={submit} className="auth-form">{mode === 'register' && <label>Full name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Aarav Sharma"/></label>}<label>Email address<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@hostel.edu"/></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters"/></label>{error && <div className="form-error"><X size={16}/> {error}</div>}{success && <div className="form-error" style={{ color: '#4e8056', background: '#e5f1e2' }}><Check size={16}/> {success}</div>}<button className="primary-button" disabled={busy}>{busy ? 'Checking...' : mode === 'login' ? 'Enter MessMate' : 'Create student account'} <ArrowRight size={17}/></button></form><p className="auth-switch">{mode === 'login' ? 'New to MessMate?' : 'Already have an account?'} <button onClick={switchMode}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></p><div className="auth-note"><ShieldCheck size={16}/> Your password is securely encrypted.</div></section></main>;
}

function ShellContent({ session, onLogout }) {
	const [theme, setTheme] = useState(() => localStorage.getItem('messmate-theme') || 'light');

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('messmate-theme', theme);
	}, [theme]);

	return <><OriginalShell session={session} onLogout={onLogout}/><button className="data-refresh" onClick={() => window.location.reload()} title="Refresh menu data" aria-label="Refresh menu data"><Clock3 size={16}/><span>Refresh menu</span></button><button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button></>;
}

function Shell({ session, onLogout }) {
	const [darkMode, setDarkMode] = useState(() => localStorage.getItem('messmate-theme') === 'dark');

	useEffect(() => {
		document.documentElement.classList.toggle('dark-mode', darkMode);
		localStorage.setItem('messmate-theme', darkMode ? 'dark' : 'light');
		return () => document.documentElement.classList.remove('dark-mode');
	}, [darkMode]);

	return <div className={darkMode ? 'theme-dark' : 'theme-light'}><ShellContent session={session} onLogout={onLogout} /><button className="theme-toggle" onClick={() => setDarkMode(value => !value)} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>{darkMode ? <Sun size={17}/> : <Moon size={17}/>}</button></div>;
}

function OriginalStudentView({ tab, token, notify }) {
	if (tab === 'activity') return <StudentActivity token={token} notify={notify} />;
	return <StudentView tab="today" token={token} notify={notify} />;
}

function StudentActivity({ token, notify }) {
	const [reviews, setReviews] = useState([]);

	useEffect(() => {
		api('/feedback/mine', {}, token).then(setReviews).catch(() => notify('Could not load your reviews'));
	}, []);

	return <section className="content-area"><div className="section-intro"><span className="eyebrow">YOUR REVIEWS</span><h2>Your honest voice.</h2><p>Every review helps the kitchen make the next meal better.</p></div><div className="review-list">{reviews.length ? reviews.map(review => <article className="review-card" key={review._id}><div className="review-card-top"><span className="review-meal-icon"><Star size={17} fill="currentColor" /></span><div><strong>Meal review</strong><small>{new Date(review.createdAt).toLocaleDateString()}</small></div><span className="review-score"><Star size={14} fill="currentColor" /> {review.overallRating}/5</span></div><div className="review-rating-line"><span>Taste <b>{review.taste}/5</b></span><span>Quality <b>{review.quality}/5</b></span><span>Quantity <b>{review.quantity}/5</b></span><span>Cleanliness <b>{review.cleanliness}/5</b></span></div><p className="review-comment">{review.comment || 'You left a rating without a written comment.'}</p></article>) : <div className="empty-state"><MessageSquare size={22}/><p>Your submitted meal reviews will appear here after you eat and rate a served meal.</p></div>}</div></section>;
}

function BaseMealCard({ type, menu, vote, reviewed, onVote, onFeedback }) {
	const Icon = mealIcons[type];
	const reviewReady = menu.served && menu.feedbackOpen;
	return <article className="meal-card"><div className="meal-photo"><img src={foodPhoto(menu)} alt={menu.items?.join(', ') || `${type} meal`} loading="lazy"/><span className="photo-label">{type}</span></div><div className="meal-top"><span className={`meal-icon ${type.toLowerCase()}`}><Icon size={21}/></span><span className="meal-time">{type}</span>{menu.served && <span className="served-tag"><Check size={12}/> served</span>}</div><h3>{menu.items?.join(' + ') || 'Menu coming soon'}</h3><p>{menu.description || 'Prepared fresh by the mess kitchen.'}</p><div className="meal-footer">{reviewed ? <span className="voted-state"><Check size={15}/> Reviewed</span> : reviewReady ? <button className="feedback-link" onClick={onFeedback}><Star size={15}/> Rate this meal</button> : menu.served ? <span className="muted review-locked">Review opens soon</span> : vote ? <span className="voted-state"><Check size={15}/> Voted: {vote.vote === 'want' ? 'Want' : 'Skip'}</span> : <div className="vote-buttons"><button onClick={() => onVote(menu._id,'want')}><ThumbsUp size={15}/> Want</button><button onClick={() => onVote(menu._id,'dont-want')}><ThumbsDown size={15}/> Skip</button></div>}</div></article>;
}

function OriginalAdminView({ tab, token, notify }) {
	return <><BaseAdminView tab={tab} token={token} notify={notify}/>{tab === 'menus' && <><ReviewApprovalPanel token={token} notify={notify}/><MenuDeletePanel token={token} notify={notify}/></>} {tab === 'feedback' && <><NamedFeedbackPanel token={token} notify={notify}/><FeedbackDeletePanel token={token} notify={notify}/></>}</>;
}

function ReviewApprovalPanel({ token, notify }) {
	const [menus, setMenus] = useState([]);
	const load = () => api('/admin/overview', {}, token).then(data => setMenus(data.menus || [])).catch(() => notify('Could not load review controls'));
	useEffect(() => { load(); }, []);
	const openReviews = async (id) => { try { await api(`/menus/${id}/open-feedback`, { method: 'PATCH' }, token); notify('Reviews are now open for students'); load(); } catch (err) { notify(err.message); } };
	const served = menus.filter(menu => menu.served);
	if (!served.length) return null;
	return <div className="review-approval"><div><span className="eyebrow">REVIEW ACCESS</span><h3>Open reviews after serving</h3><p>Students can rate a meal only after you allow reviews.</p></div>{served.map(menu => <div className="review-approval-row" key={menu._id}><div><strong>{menu.mealType}</strong><span>{menu.items?.join(' + ')}</span></div>{menu.feedbackOpen ? <span className="status published">reviews open</span> : <button className="text-button" onClick={() => openReviews(menu._id)}>Allow reviews <ArrowRight size={14}/></button>}</div>)}</div>;
}

function NamedFeedbackPanel({ token, notify }) {
	const [reviews, setReviews] = useState([]);
	useEffect(() => { api('/admin/overview', {}, token).then(data => setReviews(data.feedback || [])).catch(() => notify('Could not load student names')); }, []);
	return <div className="named-feedback-panel"><div className="panel-heading"><div><span className="eyebrow">STUDENT REVIEWS</span><h3>Who said it</h3></div><span>{reviews.length} recent</span></div>{reviews.length ? reviews.map(review => <div className="named-review-row" key={review._id}><div className="review-avatar">{review.studentId?.name?.[0] || 'S'}</div><div className="named-review-body"><strong>{review.studentId?.name || 'Student resident'}</strong><small>{review.studentId?.email || 'Student account'} · {new Date(review.createdAt).toLocaleDateString()}</small><p>{review.comment || 'No written comment.'}</p></div><span className="review-score"><Star size={14} fill="currentColor"/> {review.overallRating}/5</span></div>) : <div className="empty-state"><MessageSquare size={20}/><p>Named student reviews appear here after feedback is submitted.</p></div>}</div>;
}

function FeedbackDeletePanel({ token, notify }) {
	const [reviews, setReviews] = useState([]);
	const load = () => api('/admin/overview', {}, token).then(data => setReviews(data.feedback || [])).catch(() => notify('Could not load feedback cleanup'));
	useEffect(() => { load(); }, []);
	const remove = async (review) => { if (!window.confirm(`Delete this feedback from ${new Date(review.createdAt).toLocaleDateString()}?`)) return; try { await api(`/feedback/${review._id}`, { method: 'DELETE' }, token); notify('Feedback deleted'); load(); } catch (err) { notify(err.message); } };
	return <div className="feedback-delete-panel"><div className="panel-heading"><div><span className="eyebrow">FEEDBACK CLEANUP</span><h3>Delete by day</h3></div><span>{reviews.length} records</span></div>{reviews.map(review => <div className="feedback-delete-row" key={review._id}><div><strong>{review.studentId?.name || 'Student resident'}</strong><small>{new Date(review.createdAt).toLocaleDateString()} · {review.comment || 'Rating only'}</small></div><button className="delete-button" onClick={() => remove(review)} title="Delete feedback" aria-label="Delete feedback"><X size={15}/> Delete</button></div>)}</div>;
}

function MenuDeletePanel({ token, notify }) {
	const [menus, setMenus] = useState([]);
	const load = () => api('/admin/overview', {}, token).then(data => setMenus(data.menus || [])).catch(() => notify('Could not load delete controls'));
	useEffect(() => { load(); }, []);
	const remove = async (menu) => { if (!window.confirm(`Delete ${menu.mealType}: ${menu.items?.join(', ')}?`)) return; try { await api(`/menus/${menu._id}`, { method: 'DELETE' }, token); notify('Meal deleted'); load(); } catch (err) { notify(err.message); } };
	return <div className="menu-delete-panel"><div className="panel-heading"><div><span className="eyebrow">MENU MANAGEMENT</span><h3>Remove a meal</h3></div><span>{menus.length} records</span></div>{menus.map(menu => <div className="delete-row" key={menu._id}><div><strong>{menu.mealType}</strong><small>{menu.items?.join(' + ')}</small></div><button className="delete-button" onClick={() => remove(menu)} title={`Delete ${menu.mealType}`}><X size={15}/> Delete</button></div>)}</div>;
}

function StudentView({ tab, token, notify }) {
	const [refreshKey, setRefreshKey] = useState(0);

	useEffect(() => {
		const interval = window.setInterval(() => setRefreshKey(value => value + 1), 10000);
		return () => window.clearInterval(interval);
	}, []);

	return <PollingMenuView key={refreshKey} tab={tab} token={token} notify={notify} />;
}

function PollingMenuView({ token, notify }) {
	const [menus, setMenus] = useState([]);
	const [votes, setVotes] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [feedbackMenu, setFeedbackMenu] = useState(null);
	const [loading, setLoading] = useState(true);
	const refresh = async () => { try { const [published, mine, submitted] = await Promise.all([api('/menus', {}, token), api('/votes/mine', {}, token), api('/feedback/mine', {}, token)]); setMenus(published); setVotes(mine); setReviews(submitted); } catch { notify('Could not load the menu. Is the API running?'); } finally { setLoading(false); } };
	useEffect(() => { refresh(); }, []);
	const vote = async (menuId, choice) => { try { await api('/votes', { method: 'POST', body: JSON.stringify({ menuId, vote: choice }) }, token); notify('Your vote has been recorded'); refresh(); } catch (err) { notify(err.message); } };
	const dates = [...new Set(menus.map(menu => menu.date || 'No date'))];
	return <section className="content-area"><div className="hero-banner"><div><span className="eyebrow light">TOMORROW'S TABLE</span><h2>A menu made<br/>for your mood.</h2><p>Cast your vote before the kitchen starts.</p></div><div className="banner-plate"><Utensils size={62} strokeWidth={1.2}/></div></div><div className="section-heading"><div><span className="eyebrow">VOTE YOUR PLATE</span><h2>What sounds good?</h2></div><span className="muted">{menus.length} meals available</span></div>{loading ? <div className="loading-line">Loading today's menu...</div> : menus.length ? dates.map(date => <section className="date-menu-group" key={date}><div className="date-menu-heading"><CalendarDays size={17}/><strong>{date === 'No date' ? date : new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</strong></div><div className="meal-grid">{menus.filter(menu => (menu.date || 'No date') === date).map(menu => { const type = mealOrder.find(meal => meal.toLowerCase() === menu.mealType?.toLowerCase()) || menu.mealType; return <MealCard key={menu._id} type={type} menu={menu} vote={votes.find(item => item.menuId === menu._id)} reviewed={reviews.some(review => String(review.menuId) === String(menu._id))} onVote={vote} onFeedback={() => setFeedbackMenu(menu)}/> })}</div></section>) : <EmptyState text="The admin has not published a menu yet."/>}{feedbackMenu && <FeedbackModal menu={feedbackMenu} token={token} onClose={() => setFeedbackMenu(null)} notify={notify}/>}</section>;
}

function LegacyMealCard({ type, menu, vote, onVote, onFeedback }) {
	const Icon = mealIcons[type];
	const reviewReady = menu.served && menu.feedbackOpen;
	return <article className="meal-card"><div className="meal-photo"><img src={foodPhoto(menu)} alt={menu.items?.join(', ') || `${type} meal`} loading="lazy"/><span className="photo-label">{type}</span></div><div className="meal-top"><span className={`meal-icon ${type.toLowerCase()}`}><Icon size={21}/></span><span className="meal-time">{type}</span>{menu.served && <span className="served-tag"><Check size={12}/> served</span>}</div><h3>{menu.items?.join(' + ') || 'Menu coming soon'}</h3><p>{menu.description || 'Prepared fresh by the mess kitchen.'}</p><div className="meal-footer">{reviewReady ? <button className="feedback-link" onClick={onFeedback}><Star size={15}/> Rate this meal</button> : menu.served ? <span className="muted review-locked">Review opens soon</span> : <div className="vote-buttons"><button className={vote?.vote === 'want' ? 'chosen want' : ''} onClick={() => onVote(menu._id,'want')}><ThumbsUp size={15}/> Want</button><button className={vote?.vote === 'dont-want' ? 'chosen skip' : ''} onClick={() => onVote(menu._id,'dont-want')}><ThumbsDown size={15}/> Skip</button></div>}{vote && <span className="voted-label"><Check size={13}/> voted</span>}</div></article>;
}

function MealCard({ type, menu, vote, reviewed, onVote, onFeedback }) {
	const dateLabel = menu.date ? new Date(`${menu.date}T00:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'Date not set';
	return <div className="dated-meal-card"><BaseMealCard type={type} menu={menu} vote={vote} reviewed={reviewed} onVote={onVote} onFeedback={onFeedback}/><span className="meal-date-badge">{dateLabel}</span></div>;
}

export default App
