# Amply Widget React Component

A React component conversion of the original JavaScript/jQuery Amply donation widget module from [giveamply.com](https://giveamply.com/widget-examples).

![Amply Donation Widget](./public/openart-image_Ae-GMItV_1751918178614_raw.jpg)



## Overview

This React component provides all the functionality of the original Amply widget with modern React patterns, including:

- Multiple submission types (donation, button, watch, message, policy)
- Form validation and error handling
- Employer matching functionality
- Responsive design
- Loading states and user feedback
- Event callbacks for integration
- Configurable field mapping
- Custom styling support

## Installation

1. Copy the `AmplyWidget.jsx` and `AmplyWidget.css` files to your React project's components directory
2. Import and use the component in your application

```jsx
import AmplyWidget from './components/AmplyWidget'
```

## Usage Examples

### Basic Donation Widget

```jsx
<AmplyWidget
  submitType="donation"
  organizationId={1234}
  onSubmit={(data) => console.log('Donation:', data)}
  onMatch={(match) => console.log('Match found:', match)}
/>
```

### Policy Check Widget

```jsx
<AmplyWidget
  submitType="policy"
  onMatch={(match) => console.log('Match info:', match)}
/>
```

### Button Integration

```jsx
<AmplyWidget
  submitType="button"
  donationForm="myDonationForm"
  submitId="mySubmitButton"
  fieldId={{
    donor_name: "donorName",
    donor_email: "donorEmail",
    company_name: "employer",
    amount: "amount"
  }}
/>
```

### Watch Field Integration

```jsx
<AmplyWidget
  submitType="watch"
  watchField="statusField"
  watchValue="completed"
  fieldId={{
    donor_name: "donorName",
    donor_email: "donorEmail",
    company_name: "employer",
    amount: "amount"
  }}
/>
```

### Message Integration

```jsx
<AmplyWidget
  submitType="message"
  messageDataMap={{
    donor_name: "data.donor.name",
    donor_email: "data.donor.email",
    company_name: "data.employer.name",
    amount: "data.transaction.amount"
  }}
  messageSubmitMap="data.transaction.status"
  messageSubmitValue="complete"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `submitType` | string | 'donation' | Type of widget: 'donation', 'button', 'watch', 'message', 'policy' |
| `organizationId` | number | - | Organization ID for the donation |
| `fieldId` | object | {} | Mapping of field IDs for form integration |
| `donationForm` | string | - | ID of the donation form (for button type) |
| `submitId` | string | - | ID of the submit button (for button type) |
| `watchField` | string | - | Field to watch for changes (for watch type) |
| `watchValue` | string | - | Value to trigger submission (for watch type) |
| `messageDataMap` | object | {} | Mapping for message data fields (for message type) |
| `messageSubmitMap` | string | - | Path to submit trigger in message data |
| `messageSubmitValue` | string | - | Value to trigger submission from message |
| `retry` | boolean | true | Enable retry functionality |
| `instantMatch` | boolean | true | Enable instant employer matching |
| `onSubmit` | function | - | Callback when form is submitted |
| `onMatch` | function | - | Callback when employer match is found |
| `onError` | function | - | Callback when an error occurs |

## Submit Types

### 1. Donation (`submitType="donation"`)

Handles the entire donation flow within the widget with built-in form and payment processing.

**Features:**
- Collects donor information (name, email)
- Employer search and matching
- Amount selection with predefined options
- Form validation
- Payment processing integration

### 2. Button (`submitType="button"`)

Integrates with an existing donation form by intercepting the submit button click.

**Features:**
- Replaces existing submit button functionality
- Validates matching information before submission
- Adds matching data to form submission
- Preserves original form processing

### 3. Watch (`submitType="watch"`)

Monitors a specific field value and triggers matching when the value equals a specified value.

**Features:**
- Continuously monitors specified field
- Triggers matching on value match
- Ideal for multi-step forms
- Non-intrusive integration

### 4. Message (`submitType="message"`)

Processes browser message events to collect donation data and trigger matching.

**Features:**
- Listens for window.postMessage events
- Maps message data to donation fields
- Supports nested object paths
- Ideal for iframe-based platforms

### 5. Policy (`submitType="policy"`)

Displays only matching policy information without processing donations.

**Features:**
- Lightweight employer search
- Displays matching policies
- No donation processing
- Informational display only

## Styling

The component includes comprehensive CSS styling that can be customized by:

1. Modifying the `AmplyWidget.css` file
2. Overriding CSS classes in your application
3. Using CSS-in-JS solutions

### Key CSS Classes

- `.amply-widget-container` - Main container
- `.amply-widget` - Widget wrapper
- `.form-group` - Form field groups
- `.amount-buttons` - Amount selection buttons
- `.submit-button` - Submit button
- `.matching-info` - Employer matching display
- `.error-message` - Error message styling

## Browser Compatibility

- Modern browsers supporting ES6+
- React 16.8+ (hooks support required)
- Mobile responsive design

## Differences from Original

This React component maintains all functionality of the original JavaScript/jQuery module while providing:

1. **Modern React Patterns**: Uses hooks and functional components
2. **Better State Management**: Centralized state with React hooks
3. **Improved Type Safety**: Clear prop definitions and validation
4. **Enhanced Error Handling**: Comprehensive error states and callbacks
5. **Better Performance**: React's optimized rendering and updates
6. **Easier Integration**: Standard React component patterns
7. **Maintainable Code**: Cleaner, more readable codebase

## Development

To run the demo application:

```bash
git clone
pnmp install
cd amply-widget-react
npm run dev
```

The demo includes examples of all widget types and interactive testing capabilities.

## License

This component is a conversion of the original Amply widget. Please refer to Amply's terms of service for usage rights and restrictions.

