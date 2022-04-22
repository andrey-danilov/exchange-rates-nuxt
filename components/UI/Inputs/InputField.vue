<template>
  <wrapper-input
    :label="label"
    :value="localValue"
    :error="showError"
    :disabled="localDisabled"
    :small="small"
    :medium="medium"
    :is-focus="isFocus || focused"
    :prepare="prepare"
    :class="{ 'field--number': isNumber }"
    :show-copy="showCopy"
    :suffix="suffix"
    :readonly="readonly"
    :required="required"
  >
    <input
      ref="input"
      v-model="localValue"
      v-mask="mask"
      class="field__input"
      :type="type"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="localDisabled"
      :inputmode="inputmode"
      @keydown.delete="$emit('delete', $event)"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydownCode($event)"
    />
  </wrapper-input>
</template>

<script>
import { DELETE_KEY_CODES } from '@/config/constants/keyCodes'

export default {
  name: 'InputField',
  props: {
    label: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    mask: {
      type: [String, Function, Array],
      required: false,
      default: null,
    },
    value: {
      type: [String, Number],
      default: null,
    },
    testValid: {
      type: [String],
      default: null,
    },
    type: {
      type: String,
      default: 'text',
    },
    inputmode: {
      type: String,
      default: 'text',
    },
    error: {
      type: String,
      default: null,
    },
    regExp: {
      type: RegExp,
      default: null,
    },
    suffix: {
      type: String,
      default() {
        return ''
      },
    },
    focused: Boolean,
    disabled: Boolean,
    small: Boolean,
    medium: Boolean,
    readonly: Boolean,
    prepare: Boolean,
    showCopy: Boolean,
    required: Boolean,
  },
  data() {
    return {
      isFocus: false,
      dirty: false,
      touched: false,
      wasFocused: false,
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    isNumber() {
      return this.type === 'number'
    },
    showError() {
      return this.error && this.touched ? this.error : ''
    },
    localDisabled() {
      return Boolean(this.disabled)
    },
  },
  methods: {
    onKeydownCode($event) {
      this.dirty = this.wasFocused

      this.$emit('keydown', $event)
      const isDeleteEvent = DELETE_KEY_CODES.includes($event.keyCode)

      if (!this.regExp || isDeleteEvent) {
        return false
      }

      const isValidValue = this.regExp.test($event.target.value + $event.key)
      if (!isValidValue) {
        $event.preventDefault()

        return false
      }
    },

    onFocus() {
      this.wasFocused = true
      this.isFocus = true
    },

    onBlur() {
      this.touched = true
      this.isFocus = false
    },
  },
}
</script>
