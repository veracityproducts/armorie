# Intelligent Components
URL: /docs/copilots/motivation

***

## title: Intelligent Components

React revolutionized web development with components that combine logic, structure, and style. Now, with assistant-ui, we're adding a fourth dimension: intelligence. Let's learn how to build smart components through a practical banking app example.

## The Evolution of Components

Traditional React components combine three elements:

```tsx
// Traditional React Component
function TransactionHistory({ transactions }) {
  // 1. Logic (JavaScript/TypeScript)
  const handleRefund = (transactionId) => {
    // Process refund...
  };

  // 2. Structure (JSX/TSX)
  return (
    // 3. Style (CSS via className)
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <span>${transaction.amount}</span>
          <span>{transaction.merchant}</span>
          <button onClick={() => handleRefund(transaction.id)}>
            Request Refund
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Adding Intelligence

With assistant-ui, we can enhance this component with intelligence using four powerful APIs:

### 1. Making Components Readable (makeAssistantVisible)

First, let's make our buttons "readable" and interactive:

```tsx
import { makeAssistantVisible } from "@assistant-ui/react";

// Make the refund button intelligent
const SmartButton = makeAssistantVisible(
  ({ onClick, children }) => <button onClick={onClick}>{children}</button>,
  {
    clickable: true, // Allow the assistant to click the button
  },
);

function TransactionHistory({ transactions }) {
  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <span>${transaction.amount}</span>
          <span>{transaction.merchant}</span>
          <SmartButton onClick={() => handleRefund(transaction.id)}>
            Request Refund
          </SmartButton>
        </div>
      ))}
    </div>
  );
}
```

Now the assistant can:

* Understand the transaction history structure
* Interact with refund buttons
* Help users manage their transactions

### 2. Adding System Instructions (useAssistantInstructions)

Next, let's give the assistant specific instructions about its role:

```tsx
import { useAssistantInstructions } from "@assistant-ui/react";

function SmartTransactionHistory() {
  useAssistantInstructions(`
    You are a helpful banking assistant that:
    1. Helps users understand their transactions
    2. Explains refund policies
    3. Identifies suspicious transactions
    4. Guides users through the refund process
  `);

  return <TransactionHistory transactions={transactions} />;
}
```

### 3. Creating Tools (makeAssistantTool)

Let's add transaction-specific tools for the assistant:

```tsx
import { makeAssistantTool, tool } from "@assistant-ui/react";
import { z } from "zod";

// Define a tool to analyze transactions
const analyzeTransaction = tool({
  parameters: z.object({
    transactionId: z.string(),
    merchantName: z.string(),
  }),
  execute: async ({ transactionId, merchantName }) => {
    // Analyze transaction patterns, merchant reputation, etc.
    return {
      isSuspicious: false,
      merchantRating: 4.5,
      similarTransactions: 3,
      refundEligible: true,
    };
  },
});

// Create a tool component
const TransactionAnalyzer = makeAssistantTool({
  ...analyzeTransaction,
  toolName: "analyzeTransaction",
});

function SmartTransactionHistory() {
  // Previous instructions...
  return (
    <>
      <TransactionHistory transactions={transactions} />
      <TransactionAnalyzer />
    </>
  );
}
```

### 4. Adding Custom Context (Model Context)

Finally, let's add dynamic context based on the user's transaction patterns:

```tsx
import { useAssistantApi } from "@assistant-ui/react";
import { useEffect } from "react";

function SmartTransactionHistory({ userProfile }) {
  const api = useAssistantApi();

  useEffect(() => {
    return api.modelContext().register({
      getModelContext: () => ({
        system: `
          User spending patterns:
          - Average transaction: ${userProfile.avgTransaction}
          - Common merchants: ${userProfile.frequentMerchants.join(", ")}
          - Refund history: ${userProfile.refundCount} requests
        `,
      }),
    });
  }, [api, userProfile]);

  // Previous components...
}
```

## The Result: An Intelligent Banking Experience

This enhanced component now provides:

* Natural language interaction with transaction history
* Contextual help for understanding transactions
* Automated transaction analysis
* Smart refund assistance

The assistant can now:

1. Read and understand transaction details
2. Follow banking-specific guidelines
3. Use tools to analyze transactions
4. Access user patterns for personalized help

This creates a more intuitive and safer banking experience while maintaining the familiar React component model.

## Next Steps

Learn more about each API:

* [makeAssistantVisible](make-assistant-readable) for component understanding
* [makeAssistantTool](make-assistant-tool) for transaction analysis
* [useAssistantInstructions](use-assistant-instructions) for behavior guidance
* [Model Context](model-context) for dynamic context management



# makeAssistantTool
URL: /docs/copilots/make-assistant-tool

***

## title: makeAssistantTool

import { ParametersTable } from "@/components/docs";

`makeAssistantTool` creates a React component that provides a tool to the assistant. This is useful for defining reusable tools that can be composed into your application.

## Usage

```tsx
import { makeAssistantTool, tool } from "@assistant-ui/react";
import { z } from "zod";

// Define the tool using the tool() helper
const submitForm = tool({
  parameters: z.object({
    email: z.string().email(),
    name: z.string(),
  }),
  execute: async ({ email, name }) => {
    // Implementation
    return { success: true };
  },
});

// Create a tool component
const SubmitFormTool = makeAssistantTool({
  ...submitForm,
  toolName: "submitForm",
});

// Use in your component
function Form() {
  return (
    <div>
      <form>{/* form fields */}</form>
      <SubmitFormTool />
    </div>
  );
}
```

## API Reference

### Parameters

<ParametersTable
  type="AssistantToolProps<TArgs, TResult>"
  parameters={[
  {
    name: "toolName",
    type: "string",
    description: "The unique identifier for the tool",
    required: true,
  },
  {
    name: "parameters",
    type: "StandardSchemaV1<TArgs> | JSONSchema7",
    description:
      "Schema defining the tool's parameters (typically a Zod schema)",
    required: true,
  },
  {
    name: "execute",
    type: "(args: TArgs, context: ToolExecutionContext) => TResult | Promise<TResult>",
    description:
      "Function that implements the tool's behavior (required for frontend tools)",
    required: true,
  },
  {
    name: "description",
    type: "string",
    description: "Optional description of the tool's purpose",
  },
  {
    name: "render",
    type: "ComponentType<ToolCallMessagePartProps<TArgs, TResult>>",
    description:
      "Optional custom UI component for rendering the tool execution. Receives the following props:",
    children: [
      {
        type: "ToolCallMessagePartProps<TArgs, TResult>",
        parameters: [
          {
            name: "type",
            type: '"tool-call"',
            description: "The message part type",
          },
          {
            name: "toolCallId",
            type: "string",
            description: "Unique identifier for this tool call",
          },
          {
            name: "toolName",
            type: "string",
            description: "The name of the tool being called",
          },
          {
            name: "args",
            type: "TArgs",
            description: "The arguments passed to the tool",
          },
          {
            name: "argsText",
            type: "string",
            description: "String representation of the arguments",
          },
          {
            name: "result",
            type: "TResult | undefined",
            description: "The result of the tool execution (if complete)",
          },
          {
            name: "isError",
            type: "boolean | undefined",
            description: "Whether the result is an error",
          },
          {
            name: "status",
            type: "ToolCallMessagePartStatus",
            description:
              'The execution status object with a type property: "running", "complete", "incomplete", or "requires_action"',
          },
          {
            name: "addResult",
            type: "(result: TResult | ToolResponse<TResult>) => void",
            description:
              "Function to add a result (useful for human-in-the-loop tools)",
          },
          {
            name: "artifact",
            type: "unknown",
            description:
              "Optional artifact data associated with the tool call",
          },
        ],
      },
    ],
  },
]}
/>

### Returns

Returns a React component that:

* Provides the tool to the assistant when mounted
* Automatically removes the tool when unmounted
* Renders nothing in the DOM (returns null)

## Example with Multiple Tools

```tsx
import { makeAssistantTool, tool } from "@assistant-ui/react";
import { z } from "zod";

// Define tools
const validateEmail = tool({
  parameters: z.object({
    email: z.string(),
  }),
  execute: ({ email }) => {
    const isValid = email.includes("@");
    return { isValid, reason: isValid ? "Valid email" : "Missing @" };
  },
});

const sendEmail = tool({
  parameters: z.object({
    to: z.string().email(),
    subject: z.string(),
    body: z.string(),
  }),
  execute: async (params) => {
    // Tool logic
    return { sent: true };
  },
});

// Create tool components
const EmailValidator = makeAssistantTool({
  ...validateEmail,
  toolName: "validateEmail",
});
const EmailSender = makeAssistantTool({
  ...sendEmail,
  toolName: "sendEmail",
});

// Use together
function EmailForm() {
  return (
    <div>
      <form>{/* form fields */}</form>
      <EmailValidator />
      <EmailSender />
    </div>
  );
}
```

## Best Practices

1. **Parameter Validation**

   * Always use Zod schemas to define parameters
   * Be specific about parameter types and constraints
   * Add helpful error messages to schema validations

2. **Error Handling**

   * Return meaningful error messages
   * Consider returning partial results when possible
   * Handle async errors appropriately

3. **Composition**
   * Break complex tools into smaller, focused ones
   * Consider tool dependencies and interactions
   * Use multiple tools together for complex functionality





# makeAssistantToolUI
URL: /docs/copilots/make-assistant-tool-ui

***

## title: makeAssistantToolUI

import { ParametersTable } from "@/components/docs";

The `makeAssistantToolUI` utility is used to register a tool UI component with the Assistant.

## Usage

```tsx
import { makeAssistantToolUI } from "@assistant-ui/react";

const MyToolUI = makeAssistantToolUI({
  toolName: "myTool",
  render: ({ args, result, status }) => {
    // render your tool UI here
  },
});
```

## API

### Parameters

<ParametersTable
  type="AssistantToolUIProps<TArgs, TResult>"
  parameters={[
  {
    name: "toolName",
    type: "string",
    description:
      "The name of the tool. This must match the name of the tool defined in the assistant.",
  },
  {
    name: "render",
    type: "ComponentType<ToolCallMessagePartProps<TArgs, TResult>>",
    description:
      "A React component that renders the tool UI. Receives the following props:",
    required: true,
    children: [
      {
        type: "ToolCallMessagePartProps<TArgs, TResult>",
        parameters: [
          {
            name: "type",
            type: '"tool-call"',
            description: "The message part type",
          },
          {
            name: "toolCallId",
            type: "string",
            description: "Unique identifier for this tool call",
          },
          {
            name: "toolName",
            type: "string",
            description: "The name of the tool being called",
          },
          {
            name: "args",
            type: "TArgs",
            description: "The arguments passed to the tool",
          },
          {
            name: "argsText",
            type: "string",
            description: "String representation of the arguments",
          },
          {
            name: "result",
            type: "TResult | undefined",
            description: "The result of the tool execution (if complete)",
          },
          {
            name: "isError",
            type: "boolean | undefined",
            description: "Whether the result is an error",
          },
          {
            name: "status",
            type: "ToolCallMessagePartStatus",
            description:
              'The execution status object with a type property: "running", "complete", "incomplete", or "requires_action"',
          },
          {
            name: "addResult",
            type: "(result: TResult | ToolResponse<TResult>) => void",
            description:
              "Function to add a result (useful for human-in-the-loop tools)",
          },
          {
            name: "artifact",
            type: "unknown",
            description:
              "Optional artifact data associated with the tool call",
          },
        ],
      },
    ],
  },
]}
/>

### Returns

A React functional component that should be included in your component tree. This component doesn't render anything itself, but it registers the tool UI with the Assistant.

## Example

```tsx
import { makeAssistantToolUI } from "@assistant-ui/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";

const GetWeatherUI = makeAssistantToolUI({
  toolName: "get_weather",
  render: ({ args, result, status }) => {
    if (status.type === "requires_action")
      return <p>Getting weather for {args.location}...</p>;
    if (status.type === "running") return <p>Loading...</p>;
    if (status.type === "incomplete" && status.reason === "error")
      return <p>Error getting weather.</p>;
    if (status.type === "complete")
      return <p>The weather is {result.weather}.</p>;
    return null;
  },
});

function App() {
  return (
    <AssistantRuntimeProvider>
      {/* ...your other components */}
      <GetWeatherUI />
    </AssistantRuntimeProvider>
  );
}
```

This example shows how to create a simple UI for a `get_weather` tool. The UI will display different messages depending on the status of the tool execution.





# useAssistantInstructions
URL: /docs/copilots/use-assistant-instructions

***

## title: useAssistantInstructions

`useAssistantInstructions` is a React hook that allows you to set system instructions for your assistant-ui components.

## Usage

```tsx
import { useAssistantInstructions } from "@assistant-ui/react";

function MyComponent() {
  // Simple string usage
  useAssistantInstructions("You are a helpful form assistant...");

  // With configuration object
  useAssistantInstructions({
    instruction: "You are a helpful form assistant...",
    disabled: false, // Optional: disable the instructions
  });

  return <div>My Component</div>;
}
```

## API Reference

### Parameters

The hook accepts either:

* A string containing the system instructions
* A configuration object with:
  * `instruction`: The system instructions
  * `disabled`: Optional boolean to disable the instructions

### Behavior

The hook will:

1. Register the provided instructions as system instructions in the model context
2. Automatically clean up when the component unmounts
3. Update when the instructions change
4. Do nothing if disabled is set to true

## Example

```tsx
function SmartForm() {
  useAssistantInstructions({
    instruction: `
      You are a form assistant that:
      - Validates user input
      - Provides helpful suggestions
      - Explains any errors
      - Guides users through complex fields
    `,
  });

  return <form>{/* Your form fields here */}</form>;
}
```





# Model Context
URL: /docs/copilots/model-context

***

## title: Model Context

Model Context is the foundation of intelligence in assistant-ui components. It provides configuration and capabilities to the assistant through a context provider system.

## Core Concepts

### System Instructions

System instructions define the base behavior and knowledge available to the assistant. These can be provided in several ways:

```tsx
import {
  useAssistantInstructions,
  makeAssistantVisible,
} from "@assistant-ui/react";

// Via useAssistantInstructions
useAssistantInstructions("You are a helpful assistant...");

// Via makeAssistantVisible
const ReadableComponent = makeAssistantVisible(MyComponent);
// Automatically provides component HTML as system context
```

### Tools

Tools are functions that the assistant can use to interact with your application. They can be provided through various mechanisms:

```tsx
import {
  makeAssistantVisible,
  makeAssistantTool,
  tool,
} from "@assistant-ui/react";
import { z } from "zod";

// Via makeAssistantVisible's clickable option
const ClickableButton = makeAssistantVisible(Button, {
  clickable: true, // Provides a click tool
});

// Via makeAssistantTool
const submitForm = tool({
  parameters: z.object({
    email: z.string().email(),
    name: z.string(),
  }),
  execute: async ({ email, name }) => {
    // Implementation
    return { success: true };
  },
});

const SubmitFormTool = makeAssistantTool({
  ...submitForm,
  toolName: "submitForm"
});

// Use in your component
function Form() {
  return (
    <div>
      <form>{/* form fields */}</form>
      <SubmitFormTool />
    </div>
  );
}
```

## Context Provider System

The context provider system allows components to contribute to the model context. Here's a typical usage pattern:

```tsx
import { useAssistantApi, tool } from "@assistant-ui/react";
import { useEffect } from "react";
import { z } from "zod";

function MyComponent() {
  const api = useAssistantApi();

  // Define tool using the tool() helper
  const myTool = tool({
    parameters: z.object({
      query: z.string(),
    }),
    execute: async ({ query }) => {
      const result = await searchDatabase(query);
      return { result };
    },
  });

  useEffect(() => {
    // Register context provider
    return api.modelContext().register({
      getModelContext: () => ({
        system: "You are a helpful search assistant...",
        tools: { myTool },
      }),
    });
  }, [api]); // Re-register if api changes

  return <div>{/* component content */}</div>;
}
```

### Provider Composition

Multiple providers can be registered, and their contexts will be composed:

* System instructions are concatenated
* Tool sets are merged
* Nested readable components only contribute their context at the outermost level

## Best Practices

1. **System Instructions**

   * Keep them focused and specific to the component's purpose
   * Use useAssistantInstructions for explicit instructions
   * Let makeAssistantVisible handle component structure

2. **Tools**

   * Use the tool() helper to define tool schemas and behavior
   * Prefer makeAssistantTool for reusable tools
   * Handle errors gracefully
   * Consider async operations and loading states
   * Use the built-in click tool when possible

3. **Context Management**
   * Register providers in useEffect for proper cleanup
   * Clean up providers when components unmount
   * Avoid deeply nested readable components
   * Consider performance implications of large HTML structures





# Assistant Frame API
URL: /docs/copilots/assistant-frame

Share model context across iframe boundaries

***

title: Assistant Frame API
description: Share model context across iframe boundaries
---------------------------------------------------------

The Assistant Frame API enables iframes to provide model context (tools and instructions) to a parent window's assistant. This is particularly useful for embedded applications, plugins, or sandboxed components that need to contribute capabilities to the main assistant.

## Overview

The Assistant Frame system consists of two main components:

* **AssistantFrameProvider**: Runs inside the iframe and provides model context
* **AssistantFrameHost**: Runs in the parent window and consumes context from iframes

## Basic Usage

### In the iframe (Provider)

The iframe acts as a provider of model context using `AssistantFrameProvider`:

```tsx
// iframe.tsx
import { AssistantFrameProvider } from "@assistant-ui/react";
import { ModelContextRegistry } from "@assistant-ui/react";
import { z } from "zod";

// Create a registry to manage your model context
const registry = new ModelContextRegistry();

// Expose the registry to the parent window
AssistantFrameProvider.addModelContextProvider(registry);

// Add tools that will be available to the parent assistant
registry.addTool({
  toolName: "searchProducts",
  description: "Search for products in the catalog",
  parameters: z.object({
    query: z.string(),
    category: z.string().optional(),
  }),
  execute: async ({ query, category }) => {
    // Tool implementation runs in the iframe
    const results = await searchAPI(query, category);
    return { products: results };
  },
});

// Add system instructions
const instructionHandle = registry.addInstruction(
  "You are a helpful assistant.",
);

// update the instruction
instructionHandle.update("You have access to a product catalog search tool.");
```

### In the parent window (Host)

The parent window consumes the iframe's context using `AssistantFrameHost`:

```tsx
// parent.tsx
import { useAssistantFrameHost } from "@assistant-ui/react";
import { useRef } from "react";

function ParentComponent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Connect to the iframe's model context
  useAssistantFrameHost({
    iframeRef,
    targetOrigin: "https://trusted-iframe-domain.com", // optional for increased security
  });

  return (
    <div>
      <Thread /> {/* Your assistant-ui */}
      <iframe
        ref={iframeRef}
        src="https://trusted-iframe-domain.com/embed"
        title="Embedded App"
      />
    </div>
  );
}
```

## Advanced Usage

### ModelContextRegistry

The `ModelContextRegistry` provides a flexible way to manage model context dynamically:

```tsx
const registry = new ModelContextRegistry();

// Add a tool with handle for updates
const toolHandle = registry.addTool({
  toolName: "convertCurrency",
  description: "Convert between currencies",
  parameters: z.object({
    amount: z.number(),
    from: z.string(),
    to: z.string(),
  }),
  execute: async ({ amount, from, to }) => {
    const rate = await fetchExchangeRate(from, to);
    return { result: amount * rate, currency: to };
  },
});

// Update the tool later
toolHandle.update({
  toolName: "convertCurrency",
  description: "Convert between currencies with live rates", // Updated description
  parameters: z.object({
    amount: z.number(),
    from: z.string(),
    to: z.string(),
    includesFees: z.boolean().optional(),
  }),
  execute: async ({ amount, from, to, includesFees }) => {
    const rate = await fetchExchangeRate(from, to);
    const fee = includesFees ? 0.02 : 0; // 2% fee
    return {
      result: amount * rate * (1 - fee),
      currency: to,
      fee: includesFees ? amount * rate * fee : 0,
    };
  },
});

// Remove the tool when no longer needed
toolHandle.remove();

// Add multiple instructions
const instruction1 = registry.addInstruction("Be helpful and concise.");
const instruction2 = registry.addInstruction("Use metric units.");

// Remove instructions
instruction1.remove();
```

### Multiple Providers

You can register multiple model context providers in the same iframe:

```tsx
const catalogRegistry = new ModelContextRegistry();
const analyticsRegistry = new ModelContextRegistry();

// Add different tools to each registry
catalogRegistry.addTool({
  /* ... */
});
analyticsRegistry.addTool({
  /* ... */
});

// Register both providers
const unsubscribe1 =
  AssistantFrameProvider.addModelContextProvider(catalogRegistry);
const unsubscribe2 =
  AssistantFrameProvider.addModelContextProvider(analyticsRegistry);

// Later, unsubscribe if needed
unsubscribe1();
unsubscribe2();
```

### Security Considerations

#### Origin Validation

Both the provider and host can specify allowed origins for security:

```tsx
// In iframe - only accept messages from specific parent
AssistantFrameProvider.addModelContextProvider(
  registry,
  "https://parent-app.com",
);

// In parent - only accept messages from specific iframe
useAssistantFrameHost({
  iframeRef,
  targetOrigin: "https://iframe-app.com",
});
```

#### Tool Execution

Tools are executed in the iframe's context, keeping sensitive operations sandboxed:

```tsx
registry.addTool({
  toolName: "accessDatabase",
  description: "Query the database",
  parameters: z.object({ query: z.string() }),
  execute: async ({ query }) => {
    // This runs in the iframe with iframe's permissions
    // Parent cannot directly access the database
    const results = await db.query(query);
    return results;
  },
});
```

## API Reference

### AssistantFrameProvider

Static class that manages model context providers in an iframe.

#### Methods

##### `addModelContextProvider(provider, targetOrigin?)`

Registers a model context provider to share with parent windows.

```tsx
const unsubscribe = AssistantFrameProvider.addModelContextProvider(
  registry,
  "https://parent-domain.com", // Optional origin restriction
);
```

##### `dispose()`

Cleans up all resources and removes all providers.

```tsx
AssistantFrameProvider.dispose();
```

### AssistantFrameHost

Class that connects to an iframe's model context providers.

#### Constructor

```tsx
const host = new AssistantFrameHost(
  iframeWindow,
  targetOrigin? // Optional origin restriction
);
```

#### Methods

##### `getModelContext()`

Returns the current merged model context from the iframe.

```tsx
const context = host.getModelContext();
// { system: "...", tools: { ... } }
```

##### `subscribe(callback)`

Subscribes to model context changes.

```tsx
const unsubscribe = host.subscribe(() => {
  console.log("Context updated:", host.getModelContext());
});
```

##### `dispose()`

Cleans up the connection to the iframe.

```tsx
host.dispose();
```

### useAssistantFrameHost

React hook that manages the lifecycle of an AssistantFrameHost.

```tsx
useAssistantFrameHost({
  iframeRef: RefObject<HTMLIFrameElement>,
  targetOrigin?: string,
});
```

### ModelContextRegistry

A flexible registry for managing model context with dynamic updates.

#### Methods

##### `addTool(tool)`

Adds a tool and returns a handle for updates/removal.

```tsx
const handle = registry.addTool({
  toolName: string,
  description?: string,
  parameters: ZodSchema | JSONSchema,
  execute: (args, context) => Promise<any>,
});

handle.update(newTool); // Update the tool
handle.remove(); // Remove the tool
```

##### `addInstruction(instruction)`

Adds a system instruction and returns a handle.

```tsx
const handle = registry.addInstruction("Be concise.");
handle.update("Be detailed."); // Update instruction
handle.remove(); // Remove instruction
```

##### `addProvider(provider)`

Adds another model context provider.

```tsx
const handle = registry.addProvider(anotherProvider);
handle.remove(); // Remove provider
```

## Use Cases

### Embedded Analytics Dashboard

An analytics iframe can provide data query tools to the parent assistant:

```tsx
// In analytics iframe
registry.addTool({
  toolName: "queryMetrics",
  description: "Query analytics data",
  parameters: z.object({
    metric: z.string(),
    timeRange: z.string(),
  }),
  execute: async ({ metric, timeRange }) => {
    const data = await analyticsAPI.query(metric, timeRange);
    return { data, visualization: createChart(data) };
  },
});
```

### Plugin System

Third-party plugins can extend the assistant's capabilities:

```tsx
// In plugin iframe
registry.addTool({
  toolName: "translateText",
  description: "Translate text to another language",
  parameters: z.object({
    text: z.string(),
    targetLanguage: z.string(),
  }),
  execute: async ({ text, targetLanguage }) => {
    return await pluginAPI.translate(text, targetLanguage);
  },
});
```

### Data Visualization

Provide data visualization tools in an iframe:

```tsx
// In visualization iframe
registry.addTool({
  toolName: "createChart",
  description: "Generate a chart from data",
  parameters: z.object({
    data: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
      }),
    ),
    chartType: z.enum(["bar", "line", "pie"]),
    title: z.string().optional(),
  }),
  execute: async ({ data, chartType, title }) => {
    // Generate chart using a library like Chart.js or D3
    const chartUrl = await generateChart(data, chartType, title);
    return {
      chartUrl,
      summary: `Created ${chartType} chart with ${data.length} data points`,
    };
  },
});
```