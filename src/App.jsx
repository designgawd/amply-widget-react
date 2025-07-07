import { useState } from 'react'
import AmplyWidget from './components/AmplyWidget'
import { Button } from '@/components/ui/button.jsx'
import './App.css'

function App() {
  const [widgetType, setWidgetType] = useState('donation')
  const [showWidget, setShowWidget] = useState(true)

  const handleSubmit = (data) => {
    console.log('Form submitted:', data)
    alert('Form submitted successfully! Check console for details.')
  }

  const handleMatch = (matchData) => {
    console.log('Matching found:', matchData)
  }

  const handleError = (error) => {
    console.error('Widget error:', error)
    alert('An error occurred. Check console for details.')
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Amply Widget React Component Demo</h1>
        <p className='pb-4'>This demonstrates the converted React component from the original JavaScript/jQuery module</p>
        <p>Converted by <a href='https://eric-dumas.com' target='_blank' className='text-blue-500 font-bold'>Eric Dumas</a></p>
      </header>

      <div className="demo-controls">
        <h2>Widget Type</h2>
        <div className="button-group">
          <Button 
            variant={widgetType === 'donation' ? 'default' : 'outline'}
            onClick={() => setWidgetType('donation')}
          >
            Donation Widget
          </Button>
          <Button 
            variant={widgetType === 'policy' ? 'default' : 'outline'}
            onClick={() => setWidgetType('policy')}
          >
            Policy Widget
          </Button>
          <Button 
            variant={widgetType === 'button' ? 'default' : 'outline'}
            onClick={() => setWidgetType('button')}
          >
            Button Integration
          </Button>
        </div>
        
        <Button 
          variant="secondary" 
          onClick={() => setShowWidget(!showWidget)}
          className="toggle-button"
        >
          {showWidget ? 'Hide Widget' : 'Show Widget'}
        </Button>
      </div>

      {showWidget && (
        <div className="widget-demo">
          <h2>Live Widget Demo</h2>
          <AmplyWidget
            submitType={widgetType}
            organizationId={1234}
            retry={true}
            instantMatch={true}
            onSubmit={handleSubmit}
            onMatch={handleMatch}
            onError={handleError}
            fieldId={{
              donor_name: "donorName",
              donor_email: "donorEmail", 
              company_name: "employer",
              amount: "amount"
            }}
          />
        </div>
      )}

      <div className="documentation">
        <h2>Usage Examples</h2>
        
        <div className="code-example">
          <h3>Basic Donation Widget</h3>
          <pre><code>{`import AmplyWidget from './components/AmplyWidget'

<AmplyWidget
  submitType="donation"
  organizationId={1234}
  onSubmit={(data) => console.log('Donation:', data)}
  onMatch={(match) => console.log('Match found:', match)}
/>`}</code></pre>
        </div>

        <div className="code-example">
          <h3>Policy Check Widget</h3>
          <pre><code>{`<AmplyWidget
  submitType="policy"
  onMatch={(match) => console.log('Match info:', match)}
/>`}</code></pre>
        </div>

        <div className="code-example">
          <h3>Button Integration</h3>
          <pre><code>{`<AmplyWidget
  submitType="button"
  donationForm="myDonationForm"
  submitId="mySubmitButton"
  fieldId={{
    donor_name: "donorName",
    donor_email: "donorEmail",
    company_name: "employer",
    amount: "amount"
  }}
/>`}</code></pre>
        </div>

        <div className="code-example">
          <h3>Watch Field Integration</h3>
          <pre><code>{`<AmplyWidget
  submitType="watch"
  watchField="statusField"
  watchValue="completed"
  fieldId={{
    donor_name: "donorName",
    donor_email: "donorEmail",
    company_name: "employer",
    amount: "amount"
  }}
/>`}</code></pre>
        </div>

        <div className="code-example">
          <h3>Message Integration</h3>
          <pre><code>{`<AmplyWidget
  submitType="message"
  messageDataMap={{
    donor_name: "data.donor.name",
    donor_email: "data.donor.email",
    company_name: "data.employer.name",
    amount: "data.transaction.amount"
  }}
  messageSubmitMap="data.transaction.status"
  messageSubmitValue="complete"
/>`}</code></pre>
        </div>
      </div>

      <div className="features">
        <h2>Features Converted</h2>
        <ul>
          <li>✅ Multiple submission types (donation, button, watch, message, policy)</li>
          <li>✅ Form validation and error handling</li>
          <li>✅ Employer matching functionality</li>
          <li>✅ Responsive design</li>
          <li>✅ Loading states and user feedback</li>
          <li>✅ Event callbacks for integration</li>
          <li>✅ Configurable field mapping</li>
          <li>✅ Custom styling support</li>
        </ul>
      </div>
    </div>
  )
}

export default App

