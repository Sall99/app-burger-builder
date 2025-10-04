# User Experience Features - Burger Builder

## 🎨 Overview

This document describes the advanced UX features implemented in the Burger Builder application, designed to provide an engaging, modern, and user-friendly experience.

---

## ✅ Implemented Features

### 1. 🎬 **Burger Preview Animations**

Visual feedback when ingredients are added or removed from the burger.

#### Features:

- **Smooth Entry Animation**: New ingredients bounce in when added
- **Smooth Exit Animation**: Ingredients fade out when removed
- **CSS Transitions**: Hardware-accelerated transforms for 60fps performance
- **Visual Feedback**: Immediate response to user actions

#### Implementation:

- `src/styles/burger-animations.css` - Animation definitions
- `src/components/ui/builder/builder-animated.tsx` - Animation integration
- CSS classes: `.ingredient-enter`, `.ingredient-exit`, `.ingredient-move`

#### Animation Types:

```css
@keyframes bounceIn {
    /* Ingredient appears with bounce effect */
}

@keyframes shrinkOut {
    /* Ingredient disappears with shrink effect */
}
```

---

### 2. 🖱️ **Drag-and-Drop for Ingredient Ordering**

Interactive drag-and-drop interface for reordering burger ingredients.

#### Features:

- **Sortable Ingredients**: Drag to reorder any ingredient
- **Visual Feedback**: Ingredient opacity changes during drag
- **Keyboard Support**: Arrow keys for accessibility
- **Touch Support**: Works on mobile devices
- **Smooth Animations**: Ingredients animate to new positions

#### Implementation:

- **Library**: `@dnd-kit/core` + `@dnd-kit/sortable`
- **State Management**: Redux tracks ingredient order
- **Component**: `BuilderAnimated` with `SortableContext`

#### How It Works:

```typescript
// Drag end handler
function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
        dispatch(reorderIngredients({ fromIndex, toIndex }))
    }
}
```

#### User Experience:

1. Click and hold on any ingredient
2. Drag to desired position
3. Release to drop
4. Ingredients smoothly animate to new positions

---

### 3. ⏮️ **Undo/Redo Functionality**

Full undo/redo support for all burger building actions.

#### Features:

- **20-Action History**: Remember last 20 changes
- **Keyboard Shortcuts**:
    - `Ctrl+Z` / `Cmd+Z` - Undo
    - `Ctrl+Y` / `Cmd+Y` - Redo
    - `Ctrl+Shift+Z` / `Cmd+Shift+Z` - Redo (alternative)
- **Visual Indicators**: Buttons disabled when no action available
- **Clear Function**: Reset burger with confirmation
- **Smart History**: Automatically manages history size

#### Implementation:

```typescript
// Redux state
history: Array<{
    ingredients: { [key: string]: number }
    ingredientOrder: IngredientItem[]
    totalPrice: number
}>
historyIndex: number
```

#### Components:

- `src/hooks/use-keyboard-shortcuts.ts` - Global keyboard listener
- `src/components/ui/builder/undo-redo-controls.tsx` - UI controls

#### Actions Tracked:

- ✅ Add ingredient
- ✅ Remove ingredient
- ✅ Reorder ingredients
- ✅ Load template
- ✅ Clear burger

---

### 4. 💾 **Saved Burger Templates**

Save and load favorite burger configurations.

#### Features:

- **Save Current Burger**: Name and save any burger
- **10 Template Limit**: Automatic cleanup of oldest templates
- **Template Info**: Shows price and ingredient count
- **Quick Load**: One-click to load saved burger
- **Delete Option**: Remove unwanted templates
- **Persistent Storage**: Saved in Redux Persist (localStorage)

#### Implementation:

```typescript
interface BurgerTemplate {
    id: string
    name: string
    ingredients: { [key: string]: number }
    ingredientOrder: IngredientItem[]
    totalPrice: number
    createdAt: number
}
```

#### Component:

- `src/components/ui/builder/saved-templates.tsx`

#### User Flow:

1. **Create Burger** → Add ingredients
2. **Save** → Click "My Burgers" → "Save Current Burger"
3. **Name It** → Enter burger name (max 30 chars)
4. **Load Later** → Click "Load" on saved burger
5. **Delete** → Click trash icon to remove

#### UI Features:

- Collapsible panel
- Template count badge
- Empty state with helpful message
- Confirmation dialogs for destructive actions

---

### 5. 📱 **Social Sharing**

Share burger creations on social media platforms.

#### Features:

- **Multiple Platforms**:
    - 📘 Facebook
    - 🐦 Twitter/X
    - 💬 WhatsApp
    - 📋 Copy Link
    - 📤 Native Share (mobile)
- **Rich Share Text**: Includes ingredients and price
- **Shareable URL**: Encodes burger data in URL
- **Preview**: Shows share message before posting
- **One-Click Sharing**: Opens platform in new window

#### Implementation:

```typescript
// Generate shareable text
const generateShareText = () => {
    return `Check out my custom burger! 🍔
    ${ingredientList}
    Total: $${totalPrice}
    Build your own at ${origin}`
}

// Generate URL with burger data
const generateShareUrl = () => {
    const burgerData = btoa(JSON.stringify({ ingredients, totalPrice }))
    return `${origin}?burger=${burgerData}`
}
```

#### Component:

- `src/components/ui/builder/share-burger.tsx`

#### Share Formats:

- **Facebook**: URL + quote
- **Twitter**: Text with link
- **WhatsApp**: Text message
- **Copy Link**: Direct URL
- **Native**: Uses Web Share API (mobile)

#### Security:

- Base64 encoding for URL data
- No sensitive information in URLs
- Client-side only (no server processing)

---

## 🎯 Redux State Architecture

### Enhanced Ingredients State

```typescript
interface IngredientsState {
    // Current burger
    ingredients: { [key: string]: number }
    ingredientOrder: IngredientItem[]
    totalPrice: number

    // Undo/Redo
    history: Array<BurgerState>
    historyIndex: number

    // Templates
    savedTemplates: BurgerTemplate[]

    // Animation
    lastAction: 'add' | 'remove' | null

    // Prices
    prices: { [key: string]: number }
}
```

### Actions:

- `addIngredients(type)` - Add ingredient with history
- `removeIngredients(type)` - Remove ingredient with history
- `reorderIngredients({ fromIndex, toIndex })` - Reorder via drag-drop
- `undo()` - Undo last action
- `redo()` - Redo next action
- `clearBurger()` - Reset burger
- `saveTemplate(name)` - Save current burger
- `loadTemplate(id)` - Load saved burger
- `deleteTemplate(id)` - Delete saved burger
- `clearLastAction()` - Clear animation flag

---

## 🚀 Performance Optimizations

### Animations:

- **Hardware Acceleration**: `transform` and `opacity` only
- **RequestAnimationFrame**: Smooth 60fps animations
- **CSS Containment**: Isolated animation scopes

### Drag-and-Drop:

- **Virtualization**: Only render visible ingredients
- **Debounced Updates**: Reduce Redux dispatches
- **Memoization**: Prevent unnecessary re-renders

### State Management:

- **History Limit**: Max 20 actions to prevent memory issues
- **Template Limit**: Max 10 saved burgers
- **Lazy Loading**: Components load on demand

---

## ♿ Accessibility

### Keyboard Navigation:

- ✅ All features accessible via keyboard
- ✅ `Tab` to navigate elements
- ✅ `Enter`/`Space` to activate buttons
- ✅ `Escape` to close dialogs
- ✅ Arrow keys for drag-drop (via dnd-kit)

### Screen Readers:

- ✅ ARIA labels on all interactive elements
- ✅ Live regions for dynamic updates
- ✅ Semantic HTML structure

### Visual:

- ✅ High contrast colors
- ✅ Focus indicators
- ✅ Reduced motion support (respects user preference)

---

## 📱 Mobile Experience

### Touch Optimizations:

- Larger tap targets (44x44px minimum)
- Touch-friendly drag-and-drop
- Swipe gestures (via dnd-kit)
- Native share menu

### Responsive Design:

- Stacked layout on mobile
- Collapsible panels
- Optimized button sizes
- Bottom sheets for modals

---

## 🧪 Testing

### Unit Tests:

```bash
npm run test:unit
```

### Coverage Areas:

- ✅ Redux actions and reducers
- ✅ Undo/redo logic
- ✅ Template save/load
- ✅ Share URL generation
- ✅ Drag-drop reordering

### E2E Tests:

```bash
npm run test:e2e
```

### Test Scenarios:

- ✅ Add and remove ingredients
- ✅ Undo/redo actions
- ✅ Save and load templates
- ✅ Drag to reorder
- ✅ Share burger
- ✅ Keyboard shortcuts

---

## 🎨 Styling

### CSS Files:

- `src/styles/burger-animations.css` - All animations
- `src/app/[locales]/globals.css` - Global styles (imports animations)

### Animation Classes:

```css
/* Entry */
.ingredient-enter
.ingredient-enter-active

/* Exit */
.ingredient-exit
.ingredient-exit-active

/* Move */
.ingredient-move

/* Effects */
.ingredient-count-pulse
.total-price-flash
.control-button-press
```

---

## 🔧 Configuration

### Dependencies:

```json
{
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2"
}
```

### Installation:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## 📖 Usage Examples

### Basic Integration:

```typescript
import { BuilderAnimated } from '@/components/ui/builder'
import { UndoRedoControls } from '@/components/ui/builder/undo-redo-controls'
import { SavedTemplates } from '@/components/ui/builder/saved-templates'
import { ShareBurger } from '@/components/ui/builder/share-burger'

export default function HomePage() {
    return (
        <div>
            <UndoRedoControls />
            <BuilderAnimated ingredients={emptyIngredients} />
            <Controls />
            <SavedTemplates />
            <ShareBurger />
        </div>
    )
}
```

### With Keyboard Shortcuts:

```typescript
import { BuilderWrapper } from '@/components/ui/builder/builder-wrapper'

export default function HomePage() {
    return (
        <BuilderWrapper>
            {/* Your burger builder components */}
        </BuilderWrapper>
    )
}
```

---

## 🐛 Troubleshooting

### Issue: Animations not working

**Solution**: Ensure `burger-animations.css` is imported in `globals.css`

### Issue: Drag-drop not responding

**Solution**: Check `@dnd-kit` dependencies are installed

### Issue: Undo/redo not working

**Solution**: Verify `useKeyboardShortcuts` hook is active

### Issue: Templates not persisting

**Solution**: Ensure Redux Persist is configured correctly

### Issue: Share links broken

**Solution**: Check URL encoding and base64 implementation

---

## 🚀 Future Enhancements

### Potential Additions:

- [ ] Burger animations on build
- [ ] Ingredient physics (bounce, shake)
- [ ] Multi-burger comparison
- [ ] Burger rating system
- [ ] Community templates
- [ ] QR code sharing
- [ ] Video export
- [ ] AR burger preview

---

## 📊 Performance Metrics

### Target Metrics:

- **Animation FPS**: 60fps
- **Drag Latency**: <16ms
- **State Update**: <5ms
- **Template Load**: <100ms
- **Share Generation**: <50ms

### Monitoring:

```typescript
// Built-in performance tracking
import { reportWebVitals } from '@/lib/performance'
```

---

## 🎓 Learning Resources

### DND Kit:

- [Documentation](https://docs.dndkit.com/)
- [Examples](https://docs.dndkit.com/presets/sortable)

### Animation:

- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

### Redux:

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Persist](https://github.com/rt2zz/redux-persist)

---

## 📝 Changelog

### v1.0.0 (October 2025)

- ✅ Initial implementation of all 5 UX features
- ✅ Burger preview animations
- ✅ Drag-and-drop ordering
- ✅ Undo/redo functionality
- ✅ Saved templates
- ✅ Social sharing

---

## 👥 Contributors

Built with ❤️ for the Burger Builder project

---

## 📄 License

This feature set is part of the Burger Builder application.

---

**Happy Burger Building! 🍔**
