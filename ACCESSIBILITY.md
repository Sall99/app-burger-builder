# Accessibility (A11y) Guide

This document describes the accessibility features and best practices implemented in the Burger Builder application.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Components](#components)
- [Utilities](#utilities)
- [Keyboard Navigation](#keyboard-navigation)
- [Screen Reader Support](#screen-reader-support)
- [Testing](#testing)
- [Best Practices](#best-practices)

## Overview

The application implements WCAG 2.1 Level AA accessibility standards, ensuring the application is usable by everyone, including people using assistive technologies.

**Key Features**:

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Skip navigation links
- ✅ Focus indicators
- ✅ High contrast support
- ✅ Reduced motion support

---

## Core Features

### 1. Skip Navigation Links

Skip links allow keyboard users to bypass repetitive navigation and jump directly to main content.

**Location**: `src/components/ui/skip-link/`

**Usage**:

```tsx
import { SkipLink } from '@/components/ui'

// Added to layout
;<SkipLink />
```

**Behavior**:

- Hidden until focused
- Appears at top of page when Tab is pressed
- Jumps to `#main-content` when activated

### 2. Focus Management

Automatic focus management for modals, dialogs, and interactive elements.

**Features**:

- Focus trap in modals
- Focus restoration on close
- Visible focus indicators
- Keyboard detection

### 3. Screen Reader Announcements

Dynamic content changes are announced to screen readers.

**Location**: `src/lib/accessibility.ts`

**Usage**:

```typescript
import { announce } from '@/lib/accessibility'

// Polite announcement (default)
announce('Item added to cart')

// Assertive announcement (urgent)
announce('Error occurred', 'assertive')
```

### 4. ARIA Attributes

All interactive elements have proper ARIA attributes:

- `aria-label` - Accessible labels
- `aria-describedby` - Additional descriptions
- `aria-invalid` - Error states
- `aria-busy` - Loading states
- `aria-live` - Dynamic content regions

---

## Components

### Button Component

**Enhanced with**:

- Proper ARIA labels
- Loading state announcements
- Disabled state handling
- Focus indicators

```tsx
<Button
    label="Submit"
    aria-label="Submit form"
    aria-describedby="form-help"
    loading={isLoading}
    disabled={!isValid}
/>
```

### Input Component

**Features**:

- Associated labels (`htmlFor`)
- Error announcements (`aria-invalid`, `aria-describedby`)
- Proper `id` attributes
- Required field indicators

```tsx
<Input name="email" placeholder="Email" required errors={errors} />
```

### Controls Component

**Fixed Issues**:

- ❌ Before: `<div onClick={...}>` (not keyboard accessible)
- ✅ After: `<button onClick={...}>` (fully accessible)

**Features**:

- Button elements instead of divs
- Proper ARIA labels
- Screen reader announcements
- Focus indicators
- Keyboard navigation

```tsx
<button onClick={() => handleAdd('meat', 'Meat')} aria-label="Add Meat" className="control-button">
    <MdAdd aria-hidden="true" />
</button>
```

### Modal Component

**Accessible Modal**: `src/components/ui/modal/modal-accessible.tsx`

**Features**:

- Focus trap
- Escape key to close
- Focus restoration
- Screen reader announcements
- Proper ARIA roles

```tsx
<ModalAccessible
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    title="Checkout"
    content={<CheckoutForm />}
/>
```

---

## Utilities

### Accessibility Utilities

**Location**: `src/lib/accessibility.ts`

#### `announce(message, priority)`

Announce messages to screen readers.

```typescript
announce('Item added to cart', 'polite')
announce('Error: Invalid input', 'assertive')
```

#### `trapFocus(element)`

Trap focus within an element (modals, dialogs).

```typescript
useEffect(() => {
    if (isOpen) {
        const cleanup = trapFocus(modalRef.current)
        return cleanup
    }
}, [isOpen])
```

#### `handleActivation(event, callback)`

Handle keyboard activation (Enter/Space).

```typescript
onKeyDown={(e) => handleActivation(e, () => handleClick())}
```

#### `ListFocusManager`

Manage focus in lists (menus, dropdowns).

```typescript
const focusManager = new ListFocusManager(items)
focusManager.handleKeyDown(event)
```

#### `detectKeyboardNavigation()`

Add `.user-is-tabbing` class when keyboard is used.

```typescript
useEffect(() => {
    detectKeyboardNavigation()
}, [])
```

#### `LiveRegion`

Create persistent live region for announcements.

```typescript
const liveRegion = new LiveRegion('polite')
liveRegion.announce('Content updated')
```

---

## Keyboard Navigation

### Global Shortcuts

| Key           | Action                 |
| ------------- | ---------------------- |
| `Tab`         | Focus next element     |
| `Shift + Tab` | Focus previous element |
| `Enter`       | Activate button/link   |
| `Space`       | Activate button        |
| `Escape`      | Close modal/dialog     |

### Component-Specific

#### Controls

- `Tab` - Navigate between controls
- `Enter` / `Space` - Add/remove ingredients

#### Modal

- `Escape` - Close modal
- `Tab` - Navigate within modal (focus trapped)

#### Lists/Menus

- `Arrow Up` - Previous item
- `Arrow Down` - Next item
- `Home` - First item
- `End` - Last item

---

## Screen Reader Support

### Announcements

**Automatic**:

- Form errors
- Loading states
- Dynamic content changes
- Ingredient additions/removals

**Manual**:

```typescript
import { announce } from '@/lib/accessibility'

announce('Order placed successfully')
```

### ARIA Live Regions

**Polite** (default):

- Non-urgent updates
- Status messages
- Confirmations

**Assertive**:

- Errors
- Warnings
- Time-sensitive information

### Screen Reader-Only Content

```tsx
<span className="sr-only">Loading...</span>
```

```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
```

---

## Testing

### Manual Testing

1. **Keyboard Navigation**:
    - Navigate entire app using only keyboard
    - Check all interactive elements are reachable
    - Verify focus indicators are visible

2. **Screen Reader Testing**:
    - Test with NVDA (Windows) or VoiceOver (Mac)
    - Verify announcements are clear
    - Check ARIA labels are meaningful

3. **High Contrast Mode**:
    - Enable Windows High Contrast
    - Verify all elements are visible
    - Check focus indicators stand out

4. **Zoom Testing**:
    - Test at 200% zoom
    - Verify no content is cut off
    - Check horizontal scrolling is minimal

### Automated Testing

```bash
# Install axe-core (optional)
npm install --save-dev @axe-core/react

# Run tests
npm test
```

**Accessibility Test Example**:

```tsx
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('should have no accessibility violations', async () => {
    const { container } = render(<Component />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
})
```

### Browser DevTools

**Chrome Lighthouse**:

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run Accessibility audit
4. Target score: > 95

**axe DevTools Extension**:

- Install axe DevTools extension
- Scan pages for violations
- Fix identified issues

---

## Best Practices

### 1. Always Use Semantic HTML

```tsx
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<button onClick={handleClick}>Click me</button>
```

### 2. Provide Text Alternatives

```tsx
// ❌ Bad
<img src="logo.png" />

// ✅ Good
<Image src="logo.png" alt="Burger Builder Logo" />
```

### 3. Use ARIA Appropriately

```tsx
// ✅ Good - Descriptive label
<button aria-label="Add bacon to burger">
    <PlusIcon />
</button>

// ✅ Good - Error state
<input
    aria-invalid={hasError}
    aria-describedby="email-error"
/>
{hasError && (
    <span id="email-error">Invalid email format</span>
)}
```

### 4. Manage Focus

```tsx
// ✅ Good - Return focus on close
useEffect(() => {
    if (!isOpen && previousFocus) {
        previousFocus.focus()
    }
}, [isOpen])
```

### 5. Announce Dynamic Changes

```tsx
// ✅ Good
const handleAdd = () => {
    dispatch(addItem())
    announce('Item added to cart')
}
```

### 6. Ensure Sufficient Contrast

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Check with contrast checker tools

### 7. Support Keyboard Navigation

```tsx
// ✅ Good
onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
    }
}}
```

### 8. Test with Real Users

- Test with keyboard-only users
- Test with screen reader users
- Gather feedback and iterate

---

## Common Issues & Solutions

### Issue: Focus Lost After Action

**Solution**: Return focus to trigger element or next logical element

```typescript
const handleDelete = () => {
    deleteItem()
    nextButton.current?.focus()
}
```

### Issue: Non-Semantic Interactive Elements

**Solution**: Use `<button>` instead of `<div>` with onClick

```tsx
// Before
<div onClick={handleClick}>Click</div>

// After
<button onClick={handleClick}>Click</button>
```

### Issue: Missing Labels

**Solution**: Add `aria-label` or visible labels

```tsx
<button aria-label="Close dialog">
    <X />
</button>
```

### Issue: No Focus Indicator

**Solution**: Add visible focus styles

```css
button:focus-visible {
    outline: 2px solid #fb923c;
    outline-offset: 2px;
}
```

---

## Resources

### Tools

- **Wave**: Web accessibility evaluation tool
- **axe DevTools**: Browser extension for accessibility testing
- **Lighthouse**: Built into Chrome DevTools
- **NVDA**: Free screen reader (Windows)
- **VoiceOver**: Built-in screen reader (Mac/iOS)

### Documentation

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)

### Testing Services

- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Accessibility Insights](https://accessibilityinsights.io/)
- [Pa11y](https://pa11y.org/)

---

## Checklist

### Before Launch

- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] All buttons/links have accessible names
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators are visible
- [ ] Screen reader testing completed
- [ ] Lighthouse accessibility score > 95
- [ ] No axe violations
- [ ] Skip links implemented
- [ ] ARIA attributes used correctly

### Regular Audits

- [ ] Monthly accessibility review
- [ ] Test with real assistive technology users
- [ ] Update based on feedback
- [ ] Keep up with WCAG updates
- [ ] Train team on accessibility

---

**Last Updated**: October 2025

For questions about accessibility, contact the development team or refer to [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/).
