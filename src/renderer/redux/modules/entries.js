import { combineReducers } from 'redux';
import { initialize } from 'redux-form';
import deepAssign from 'deep-assign';
import * as entryTools from '../../system/buttercup/entries';
import { GROUP_SELECTED } from './groups';

export const ENTRIES_LOADED = 'buttercup/entries/LOADED'; 
export const ENTRIES_SELECTED = 'buttercup/entries/SELECTED'; 
export const ENTRIES_UPDATED = 'buttercup/entries/UPDATED'; 

// Reducers ->

function byId(state = {}, action) {
  switch (action.type) {
    case ENTRIES_LOADED: {
      const nextState = {...state};
      action.payload.forEach(entry => {
        nextState[entry.id] = entry;
      });
      return nextState;
    }
    case ENTRIES_UPDATED:
      return {
        ...state,
        [action.payload.id]: deepAssign(state[action.payload.id], action.payload)
      };
    default:
      return state;
  }
}

function shownIds(state = [], action) {
  switch (action.type) {
    case ENTRIES_LOADED:
      return action.payload.map(entry => entry.id);
    default:
      return state;
  }
}

function currentEntry(state = null, action) {
  switch (action.type) {
    case ENTRIES_SELECTED:
      return action.payload;
    case GROUP_SELECTED:
      return null;
    default:
      return state;
  }
}

// Selectors ->

export const getCurrentEntries = state =>
  state.shownIds.map(id => state.byId[id]);

export const getCurrentEntry = state =>
  state.byId[state.currentEntry];

export const getEntry = (state, entryId) =>
  state.byId[entryId];

// Action Creators ->

export const loadEntries = groupId => dispatch => {
  const entries = entryTools.loadEntries(groupId);
  dispatch({
    type: ENTRIES_LOADED,
    payload: entries
  });
};

export const selectEntry = entryId => (dispatch, getState) => {
  dispatch({
    type: ENTRIES_SELECTED,
    payload: entryId
  });
  dispatch(
    initialize(
      'editForm',
      getEntry(getState().entries, entryId)
    )
  );
};

export const updateEntry = newValues => ({
  type: ENTRIES_UPDATED,
  payload: newValues
});

export default combineReducers({
  byId,
  shownIds,
  currentEntry
});
