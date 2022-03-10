import React from 'react'
import styled from 'styled-components'
import { withState } from 'reaclette'
import { withRouter } from 'react-router'
import { Switch, Route } from 'react-router-dom'

import TabConsole from './TabConsole'
import TreeView from './TreeView'
import Pool from './Pool'

const Container = styled.div`
  display: flex;
  overflow: hidden;
`
const LeftPanel = styled.div`
  background: #f5f5f5;
  min-width: 15em;
  overflow-y: scroll;
  width: 20%;
`
// FIXME: temporary work-around while investigating flew-grow issue:
// `overflow: hidden` forces the console to shrink to the max available width
// even when the tree component takes more than 20% of the width due to
// `min-width`
const MainPanel = styled.div`
  overflow: hidden;
  width: 80%;
`

interface ParentState {}

interface State {
  selectedVm?: string
}

interface Props {
  location: object
}

interface ParentEffects {}

interface Effects {
  initialize: () => void
}

interface Computed {}

const Infrastructure = withState<State, Props, Effects, Computed, ParentState, ParentEffects>(
  {
    initialState: props => ({
      selectedVm: props.location.pathname.split('/')[3],
    }),
  },
  ({ state: { selectedVm } }) => (
    <Container>
      <LeftPanel>
        <TreeView defaultSelectedNodes={selectedVm === undefined ? undefined : [selectedVm]} />
      </LeftPanel>
      <MainPanel>
        <Switch>
          <Route exact path='/infrastructure/pool/dashboard'>
            <Pool />
          </Route>
          <Route exact path='/infrastructure/pool/system'>
            <Pool />
          </Route>
          <Route
            path='/infrastructure/vms/:id/console'
            render={({
              match: {
                params: { id },
              },
            }) => <TabConsole key={id} vmId={id} />}
          />
        </Switch>
      </MainPanel>
    </Container>
  )
)

export default withRouter(Infrastructure)
