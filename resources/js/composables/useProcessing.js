/**
 * Keep track of various processing events
 */
import { reactive } from 'vue';


// === Data ===
const state = reactive({
  codes: {},
});


// === Methods ===
/**
 * Clear event code to indicate the event has finished processing
 *
 * @param {string} eventCode A unique string to identify an event
 */
const clearEvent = (eventCode) => {
  delete state.codes[eventCode];
}

/**
 * Generate a random event code using random function
 *
 * @param {string} prefix
 */
const generateEventCode = (prefix) => {
  const crypto = window.crypto || window.msCrypto
  const randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];
  return `${prefix}_${randomNumber}`;
}

/**
 * Check whether an event is processing
 *
 * @param {string} [eventCode] If not specified, check if ANY event is processing
 * @returns {boolean}
 */
const isEventProcessing = (eventCode = null) => {
  const stateEventCodes = Object.keys(state.codes)

  if (eventCode) {
    // Check if a specific event is processing
    return stateEventCodes.includes(eventCode)
  }

  return stateEventCodes.length > 0
}

/**
 * Set event code to indicate the event is processing
 *
 * @param {string} eventCode A unique string to identify an event
 * @param {boolean} [isExclusive=true] Whether this is the only event of eventCode that should be processing
 * @returns {boolean} Whether code is set
 */
const setEvent = (eventCode, isExclusive = true) => {
  if (isExclusive && Object.keys(state.codes).includes(eventCode)) {
    // At least one other event is processing, cannot set exclusive event
    return false
  }

  state.codes[eventCode] = true;

  return true
}


export default () => {
  return {
    clearEvent,
    generateEventCode,
    isEventProcessing,
    setEvent,
  };
};
