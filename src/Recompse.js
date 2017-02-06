import React, {PropTypes} from "react";
import {compose, setPropTypes, mapProps, getContext, withHandlers, lifecycle} from "recompose";
import {inputValueChanged, setInputInteraction} from "../Actions/fields";
import {isMultipleValueInput} from "../Mixins/InputSetUp";
import {isUndefined, isEqual} from "lodash";
import {Iterable, is} from "immutable";

const InputSetup = {
  componentWillMount() {
    this.props.inputChanged(this.props.value, false);
  },

  componentWillReceiveProps(nextProps){
    if (Iterable.isIterable(nextProps.defaultValue) && Iterable.isIterable(this.props.defaultValue) && !is(nextProps.defaultValue, this.props.defaultValue)) {
      return this.props.inputChanged(nextProps.defaultValue, false)
    }
    else if (!(Iterable.isIterable(nextProps.defaultValue) && Iterable.isIterable(this.props.defaultValue)) && !isEqual(nextProps.defaultValue, this.props.defaultValue)) {
      this.props.inputChanged(nextProps.defaultValue, false);
    }
    if (!nextProps.FormState.hasIn([nextProps.nameSpace, ...nextProps.inputPath])) {
      nextProps.inputChanged(nextProps.value, false);
    }
  }
};

const getUnsetValue = ({type}) => {
  if (type === 'radio' || type === 'checkbox') {
    return false;
  } else {
    return '';
  }
};

export default compose(
  setPropTypes({
    name: PropTypes.string.isRequired,
    id: (props, propName, componentName) => {
      if (isMultipleValueInput(props.name) && props[propName] === undefined) {
        return new Error(componentName + " components with multiple values (name[]) enabled must have an accompanying ID");
      }
    },
    value: (props, propName, componentName) => {
      if (!isUndefined(props.value)) {
        return new Error(componentName + " value is not supported use defaultValue instead");
      }
    }
  }),
  getContext({
    dispatch: PropTypes.func,
    onUpdateState: PropTypes.func
  }),
  mapProps(({inputInfo, defaultValue, defaultChecked, defaultSelected, getInputPath, ...props}) => {
    const allInputsDefaultValue = defaultValue || defaultChecked || defaultSelected;
    const value = inputInfo.get('value') !== undefined ? inputInfo.get('value') : props.value !== undefined ?
      props.value : allInputsDefaultValue || getUnsetValue(props);
    return {
      ...props,
      defaultValue: allInputsDefaultValue,
      inputPath: getInputPath(),
      value
    };
  }),
  withHandlers({
    inputChanged: ({dispatch, nameSpace, inputPath, name}) => (value, changed = true) => {
      dispatch(inputValueChanged(nameSpace, inputPath, value, changed));
    },
    inputInteraction: ({dispatch, nameSpace, inputPath}) => () => {
      dispatch(setInputInteraction(nameSpace, inputPath, 'blurred', true));
    },
    getAttributes: ({children, className, defaultValue, defaultChecked, defaultSelected, value, ...props}) => () => {
      const reactProps = Object.assign({}, props, {
        ref: props.name,
        value
      });
      const {
        customValidation, nameSpace, FormState, inputGroupInfo, dispatch, onUpdateState, labelFor,
        options, component, ...safeProps
      } = reactProps;
      if (props.type === 'checkbox' || props.type === 'radio') {
        if (props.type === 'radio') {
          return Object.assign({}, safeProps, {
            checked: props.id + "" === value + ""
          });
        } else {
          return Object.assign({}, safeProps, {
            checked: value
          });
        }
      }
      return safeProps;
    }
  }),
  lifecycle(InputSetup)
);