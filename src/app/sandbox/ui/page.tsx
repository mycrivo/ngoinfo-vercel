import { Button } from "@/features/ui/Button";
import { Input } from "@/features/ui/Input";
import { Card } from "@/features/ui/Card";
import { Banner } from "@/features/ui/Banner";

/**
 * UI Sandbox - Component Showcase
 * 
 * Visual QA page for all UI primitives.
 * Demonstrates variants, sizes, states, and interactions.
 * 
 * Note: Brand tokens will be applied in 2A.
 * Current styling uses placeholder CSS variables.
 */

export default function UISandboxPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold">UI Kit Sandbox</h1>
        <p className="text-gray-600 mt-2">
          Component showcase with placeholder styling. Brand tokens will apply in 2A.
        </p>
      </header>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        
        <div className="space-y-6">
          {/* Primary Buttons */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Primary</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="md" disabled>Disabled</Button>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Secondary</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm">Small</Button>
              <Button variant="secondary" size="md">Medium</Button>
              <Button variant="secondary" size="lg">Large</Button>
              <Button variant="secondary" size="md" disabled>Disabled</Button>
            </div>
          </div>

          {/* Link Buttons */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Link</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="link" size="sm">Small Link</Button>
              <Button variant="link" size="md">Medium Link</Button>
              <Button variant="link" size="lg">Large Link</Button>
              <Button variant="link" size="md" disabled>Disabled Link</Button>
            </div>
          </div>

          {/* Full Width */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Full Width</h3>
            <Button variant="primary" size="md" fullWidth>Full Width Button</Button>
          </div>
        </div>
      </section>

      {/* Input Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Inputs</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Text Input */}
          <Input
            id="text-input"
            variant="text"
            label="Text Input"
            placeholder="Enter text..."
            helperText="This is helper text"
          />

          {/* Email Input */}
          <Input
            id="email-input"
            variant="email"
            label="Email Input"
            placeholder="you@example.com"
          />

          {/* Password Input */}
          <Input
            id="password-input"
            variant="password"
            label="Password"
            placeholder="••••••••"
          />

          {/* Error State */}
          <Input
            id="error-input"
            variant="text"
            label="Error State"
            error
            errorMessage="This field is required"
            defaultValue="Invalid value"
          />

          {/* Disabled State */}
          <Input
            id="disabled-input"
            variant="text"
            label="Disabled"
            placeholder="Cannot edit"
            disabled
          />

          {/* Select */}
          <Input
            id="select-input"
            variant="select"
            label="Select Input"
            options={[
              { value: "", label: "Choose an option" },
              { value: "1", label: "Option 1" },
              { value: "2", label: "Option 2" },
              { value: "3", label: "Option 3" },
            ]}
          />
        </div>

        {/* Textarea */}
        <Input
          id="textarea-input"
          variant="textarea"
          label="Textarea"
          placeholder="Enter multiple lines..."
          rows={4}
          helperText="Maximum 500 characters"
        />

        {/* Full Width Input */}
        <Input
          id="fullwidth-input"
          variant="text"
          label="Full Width Input"
          placeholder="Spans full width"
          fullWidth
        />
      </section>

      {/* Card Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cards</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Card */}
          <Card>
            <h3 className="text-lg font-semibold mb-2">Basic Card</h3>
            <p className="text-gray-600">
              This is a basic card with default padding and elevation.
            </p>
          </Card>

          {/* Card with Header */}
          <Card
            header={<h3 className="text-lg font-semibold">Card with Header</h3>}
          >
            <p className="text-gray-600">
              This card has a separate header section with a border.
            </p>
          </Card>

          {/* Card with Footer */}
          <Card
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Save</Button>
              </div>
            }
          >
            <h3 className="text-lg font-semibold mb-2">Card with Footer</h3>
            <p className="text-gray-600">
              This card includes a footer section for actions.
            </p>
          </Card>

          {/* Card with Both */}
          <Card
            header={<h3 className="text-lg font-semibold">Complete Card</h3>}
            footer={
              <p className="text-sm text-gray-500">Last updated: Just now</p>
            }
          >
            <p className="text-gray-600">
              This card has both header and footer sections.
            </p>
          </Card>
        </div>

        {/* Elevation Variants */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Elevation Variants</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Card elevation="none" padding="sm">
              <p className="text-sm">No Shadow</p>
            </Card>
            <Card elevation="sm" padding="sm">
              <p className="text-sm">Small Shadow</p>
            </Card>
            <Card elevation="md" padding="sm">
              <p className="text-sm">Medium Shadow</p>
            </Card>
            <Card elevation="lg" padding="sm">
              <p className="text-sm">Large Shadow</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Banner Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Banners</h2>
        
        <div className="space-y-3">
          <Banner variant="info">
            <strong>Info:</strong> This is an informational message.
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
            <strong>Dismissible:</strong> Click the × button to dismiss this banner.
          </Banner>
        </div>
      </section>

      {/* Interactive States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interactive States</h2>
        
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Hover States</h3>
              <p className="text-sm text-gray-600 mb-3">
                Hover over buttons and inputs to see state changes.
              </p>
              <div className="flex gap-2">
                <Button variant="primary">Hover Me</Button>
                <Button variant="secondary">Hover Me</Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Focus States</h3>
              <p className="text-sm text-gray-600 mb-3">
                Tab through inputs to see focus rings (WCAG compliant).
              </p>
              <div className="space-y-2">
                <Input id="focus-1" variant="text" placeholder="Tab to focus" />
                <Input id="focus-2" variant="text" placeholder="Tab to focus" />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Active States</h3>
              <p className="text-sm text-gray-600 mb-3">
                Click and hold buttons to see active states.
              </p>
              <Button variant="primary">Click and Hold</Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Accessibility Notes */}
      <section>
        <Card>
          <h2 className="text-xl font-semibold mb-3">Accessibility Features</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ 44×44px minimum tap targets (WCAG 2.5.5)</li>
            <li>✓ Keyboard navigation support (Tab, Enter, Space)</li>
            <li>✓ Clear focus indicators (visible outline)</li>
            <li>✓ ARIA labels and roles for screen readers</li>
            <li>✓ Semantic HTML elements (button, input, etc.)</li>
            <li>✓ Error messages properly associated with inputs</li>
            <li>✓ Color contrast meets WCAG AA standards</li>
          </ul>
        </Card>
      </section>

      {/* Implementation Note */}
      <section>
        <Banner variant="info">
          <strong>Note:</strong> These components use placeholder CSS variables (e.g., <code>--placeholder-primary-bg</code>).
          Brand-specific tokens and theming will be applied in Cluster 2A.
        </Banner>
      </section>
    </div>
  );
}

