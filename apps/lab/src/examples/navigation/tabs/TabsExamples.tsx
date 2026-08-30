import * as React from 'react';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsPanel,
} from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function UncontrolledTabsExample() {
  const [latestTab, setLatestTab] = React.useState('Design');

  return (
    <ExampleFrame
      title="Uncontrolled Tabs"
      description="An uncontrolled Tabs set that manages its own selection. The initial tab is Design. The status below reflects the latest selected tab from onValueChange."
    >
      <TabsRoot defaultValue="design" onValueChange={(value) => setLatestTab(value)}>
        <TabsList label="Document sections">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="prototype">Prototype</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>
        <TabsPanel value="design">
          <p>This section documents the design decisions for the project.&nbsp;It is selected by default.</p>
        </TabsPanel>
        <TabsPanel value="prototype">
          <p>Here you can find links to interactive prototypes and mockups.&nbsp;Select the Prototype tab to explore them.</p>
        </TabsPanel>
        <TabsPanel value="review">
          <p>Review notes, feedback, and stakeholder comments are collected in this section.&nbsp;Switch to Review to see them.</p>
        </TabsPanel>
      </TabsRoot>
      <output role="status">Latest tab: {latestTab}</output>
    </ExampleFrame>
  );
}

function ControlledTabsExample() {
  const [tab, setTab] = React.useState('overview');
  const [lastRequested, setLastRequested] = React.useState<string | null>(null);

  return (
    <ExampleFrame
      title="Controlled Tabs"
      description="A controlled Tabs set whose value is managed by parent React state. The status below names each requested tab change."
    >
      <TabsRoot value={tab} onValueChange={(value) => {
        setLastRequested(value);
        setTab(value);
      }}>
        <TabsList label="Settings categories">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
        </TabsList>
        <TabsPanel value="overview">
          <p>General settings and application preferences are shown here.&nbsp;This overview tab is the controlled initial value.</p>
        </TabsPanel>
        <TabsPanel value="accounts">
          <p>Account management settings, profile data, and session controls belong in this tab.&nbsp;Navigate via the Accounts trigger to view them.</p>
        </TabsPanel>
      </TabsRoot>
      <output role="status">
        {lastRequested === null
          ? 'No tab change yet'
          : `Last requested tab: ${lastRequested}`}
      </output>
    </ExampleFrame>
  );
}

export function TabsExamples(): React.ReactNode {
  return (
    <>
      <UncontrolledTabsExample />
      <ControlledTabsExample />
    </>
  );
}
