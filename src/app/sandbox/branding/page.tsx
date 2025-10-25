import { Button } from "@/features/ui/Button";
import { Input } from "@/features/ui/Input";
import { Card } from "@/features/ui/Card";
import { Banner } from "@/features/ui/Banner";

/**
 * Branding Sandbox - Visual QA for NGOInfo Design System
 * 
 * Displays design tokens, typography, and all component variants.
 * Used for manual testing and accessibility verification.
 */

export const metadata = {
  title: "Branding System - NGOInfo",
  description: "Design system tokens and components",
};

export default function BrandingSandboxPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-16 py-8">
      {/* Header */}
      <header className="border-b pb-6">
        <h1>NGOInfo Design System</h1>
        <p className="text-secondary mt-2">
          Brand tokens, typography, and component library showcase
        </p>
      </header>

      {/* Design Tokens */}
      <section className="space-y-6">
        <h2>Design Tokens</h2>
        
        {/* Core Palette */}
        <div>
          <h3 className="mb-4">Core Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-lg" style={{backgroundColor: 'var(--colour-primary)'}}></div>
              <p className="text-small font-medium">Primary<br/>#2338F6</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg" style={{backgroundColor: 'var(--colour-secondary)'}}></div>
              <p className="text-small font-medium">Secondary<br/>#795CFB</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg" style={{backgroundColor: 'var(--colour-accent)'}}></div>
              <p className="text-small font-medium">Accent<br/>#FFC857</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg" style={{backgroundColor: 'var(--colour-dark)'}}></div>
              <p className="text-small font-medium text-inverse" style={{backgroundColor: 'var(--colour-dark)', padding: '0.5rem'}}>Dark<br/>#180466</p>
            </div>
          </div>
        </div>

        {/* Functional Colors */}
        <div>
          <h3 className="mb-4">Functional Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-16 rounded-lg" style={{backgroundColor: 'var(--colour-success)'}}></div>
              <p className="text-small font-medium">Success</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg" style={{backgroundColor: 'var(--colour-warning)'}}></div>
              <p className="text-small font-medium">Warning</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg" style={{backgroundColor: 'var(--colour-error)'}}></div>
              <p className="text-small font-medium">Error</p>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <h2>Typography (Poppins)</h2>
        
        <div className="space-y-4">
          <div>
            <h1>Heading 1 - The quick brown fox</h1>
            <p className="text-small text-secondary">3rem (48px) / Bold (700)</p>
          </div>
          <div>
            <h2>Heading 2 - The quick brown fox jumps</h2>
            <p className="text-small text-secondary">2.25rem (36px) / Bold (700)</p>
          </div>
          <div>
            <h3>Heading 3 - The quick brown fox jumps over</h3>
            <p className="text-small text-secondary">1.75rem (28px) / Semibold (600)</p>
          </div>
          <div>
            <p style={{fontSize: 'var(--text-body-l)'}}>Body Large - The quick brown fox jumps over the lazy dog. Perfect for introductions and lead paragraphs.</p>
            <p className="text-small text-secondary">1.125rem (18px) / Regular (400)</p>
          </div>
          <div>
            <p>Body - The quick brown fox jumps over the lazy dog. Default text for paragraphs and content.</p>
            <p className="text-small text-secondary">1rem (16px) / Regular (400)</p>
          </div>
          <div>
            <p className="text-small">Small - The quick brown fox jumps over the lazy dog. Used for captions and helper text.</p>
            <p className="text-small text-secondary">0.875rem (14px) / Medium (500)</p>
          </div>
        </div>

        {/* Typography on Surfaces */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="mb-2">On Default Surface</h3>
            <p>Text maintains AA contrast on white backgrounds.</p>
            <p className="text-secondary mt-2">Secondary text is muted but readable.</p>
          </Card>
          <Card style={{backgroundColor: 'var(--surface-subtle)'}}>
            <h3 className="mb-2">On Subtle Surface</h3>
            <p>Text maintains AA contrast on tinted backgrounds.</p>
            <p className="text-secondary mt-2">Secondary text is muted but readable.</p>
          </Card>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <h2>Buttons</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="mb-3">Primary Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium (Default)</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="md" disabled>Disabled</Button>
            </div>
          </div>
          
          <div>
            <h3 className="mb-3">Secondary Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm">Small</Button>
              <Button variant="secondary" size="md">Medium (Default)</Button>
              <Button variant="secondary" size="lg">Large</Button>
              <Button variant="secondary" size="md" disabled>Disabled</Button>
            </div>
          </div>
          
          <div>
            <h3 className="mb-3">Link Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="link" size="sm">Small Link</Button>
              <Button variant="link" size="md">Medium Link</Button>
              <Button variant="link" size="lg">Large Link</Button>
              <Button variant="link" size="md" disabled>Disabled Link</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-6">
        <h2>Inputs</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            id="text-default"
            variant="text"
            label="Default State"
            placeholder="Enter text..."
            helperText="This is helper text"
          />
          
          <Input
            id="text-error"
            variant="text"
            label="Error State"
            error
            errorMessage="This field is required"
            defaultValue="Invalid input"
          />
          
          <Input
            id="select-demo"
            variant="select"
            label="Select Input"
            options={[
              { value: "", label: "Choose an option" },
              { value: "1", label: "Option 1" },
              { value: "2", label: "Option 2" },
            ]}
          />
          
          <Input
            id="disabled-demo"
            variant="text"
            label="Disabled State"
            disabled
            placeholder="Cannot edit"
          />
        </div>
        
        <Input
          id="textarea-demo"
          variant="textarea"
          label="Textarea"
          placeholder="Enter multiple lines..."
          rows={4}
          fullWidth
        />
      </section>

      {/* Cards */}
      <section className="space-y-6">
        <h2>Cards</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card elevation="none">
            <h3 className="mb-2">No Shadow</h3>
            <p className="text-secondary text-small">elevation="none"</p>
          </Card>
          <Card elevation="sm">
            <h3 className="mb-2">Small Shadow</h3>
            <p className="text-secondary text-small">elevation="sm" (default)</p>
          </Card>
          <Card elevation="md">
            <h3 className="mb-2">Medium Shadow</h3>
            <p className="text-secondary text-small">elevation="md"</p>
          </Card>
        </div>
        
        <Card 
          header={<h3>Card with Header</h3>}
          footer={<Button variant="primary" size="sm">Action</Button>}
          elevation="md"
        >
          <p>This card has both header and footer slots with medium elevation.</p>
        </Card>
      </section>

      {/* Banners */}
      <section className="space-y-6">
        <h2>Banners</h2>
        
        <div className="space-y-3">
          <Banner variant="info">
            <strong>Info:</strong> This is an informational message using semantic tokens.
          </Banner>
          
          <Banner variant="success">
            <strong>Success:</strong> Your changes have been saved successfully.
          </Banner>
          
          <Banner variant="warning">
            <strong>Warning:</strong> Your session will expire in 5 minutes.
          </Banner>
          
          <Banner variant="error">
            <strong>Error:</strong> Something went wrong. Please try again.
          </Banner>
          
          <Banner variant="info" dismissible>
            <strong>Dismissible:</strong> Click the × to dismiss this banner.
          </Banner>
        </div>
      </section>

      {/* Accessibility Features */}
      <section>
        <Card>
          <h2 className="mb-4">Accessibility Features</h2>
          <ul className="space-y-2 text-small">
            <li>✓ WCAG AA contrast ratios for all text/background combinations</li>
            <li>✓ Visible focus rings (2px, offset) for keyboard navigation</li>
            <li>✓ 44×44px minimum tap targets (WCAG 2.5.5)</li>
            <li>✓ ARIA labels and roles for screen readers</li>
            <li>✓ Error messages announced with role="alert"</li>
            <li>✓ Respects prefers-reduced-motion</li>
            <li>✓ Semantic HTML structure</li>
            <li>✓ Poppins font with tabular numerals and ligatures</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}

