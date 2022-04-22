<template>
  <div
    class="field"
    :class="{
      'field--small': small,
      'field--medium': medium,
      'field--focus': isFocus || isNotNullValue || disabled,
      'field--disabled': disabled,
      'field--readonly': readonly,
      'field-skeleton': prepare,
    }"
  >
    <label
      class="field__label"
      :class="{
        'field__label--error': error,
        'field__label--fill': isNotNullValue,
      }"
    >
      <slot v-if="$slots.default"></slot>
      <span class="field__suffix">{{ suffix }}</span>
      <p v-if="label" class="field__span">
        {{ label }}
        <span v-if="required" class="required-identifier">*</span>
      </p>
    </label>
    <transition name="fade">
      <span v-if="error" class="field__error-message">
        {{ error }}
      </span>
    </transition>

    <button
      v-if="showCopy && !prepare"
      ref="clipboardButton"
      type="button"
      class="field__clipboard"
      :class="{ 'field__clipboard--copied': clipboardSuccess }"
      @click="copy"
    ></button>
  </div>
</template>

<script>
export default {
  name: 'WrapperInput',
  props: {
    label: {
      type: String,
      default: null,
    },
    value: {
      type: [String, Number],
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    suffix: {
      type: String,
      default() {
        return ''
      },
    },
    disabled: Boolean,
    small: Boolean,
    medium: Boolean,
    isFocus: Boolean,
    showCopy: Boolean,
    prepare: Boolean,
    readonly: Boolean,
    required: Boolean,
  },
  data() {
    return {
      clipboardSuccess: false,
    }
  },
  computed: {
    isNotNullValue() {
      return !!this.value
    },
  },
  methods: {
    async copy() {
      await navigator.clipboard.writeText(`${this.value}`)

      this.clipboardSuccess = true
      setTimeout(() => {
        this.clipboardSuccess = false
      }, 2000)
    },
  },
}
</script>

<style lang="scss">
.field {
  position: relative;
  text-align: left;

  &__label {
    position: relative;
    border: 1px solid $gray11;
    background: $white;
    border-radius: 5px;
    padding: 20px 0 20px 30px;
    transition: border-color 0.3s;
    white-space: nowrap;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--error {
      border-color: $red;
    }
  }

  &--focus &__label {
    border-color: $greenish;
  }

  &__error-message {
    padding-top: 8px;
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: left;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: $red;
    transform: translateY(100%);
  }

  &__span {
    font-size: 0.86em;
    display: block;
    background: $white;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    color: $gray1;
    padding: 0 13px;
    pointer-events: none;

    transition-duration: 0.3s;
    border-radius: 10px;
  }

  &--focus &__span {
    top: 0;
    left: calc(100% - 13px);
    transform: translateY(-50%) translateX(-100%);
    color: $greenish;
  }

  &__input {
    border: none;
    outline: none;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    width: 100%;

    &:disabled {
      background: transparent;
    }
  }

  &__suffix {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: $gray1;
  }

  &--number &__label {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0;
    width: 100px;
    border-color: $gray6;
    background: $gray6;

    &--fill {
      background: linear-gradient(360deg, $greenish 29.49%, $secondary 123.01%);
      color: $white;
    }
  }

  &--number &__label:focus-within {
    border-color: $greenish;
  }

  &__clipboard {
    position: absolute;
    z-index: 1;
    cursor: pointer;

    right: 0;
    top: 50%;

    transform: translateY(-50%) translateX(50%);

    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 38px;
    height: 38px;

    border-radius: 50%;
    background: $gray2;

    transition-property: background, opacity;
    transition-duration: 0.3s;

    opacity: 0;
    color: $white;

    &--copied {
      background: $green;
      opacity: 1;
    }
  }

  &:hover &__clipboard {
    opacity: 1;
  }

  &--number &__input {
    text-align: center;
    background: transparent;
    width: 100%;
  }

  &--small &__label {
    padding: 11px 10px 11px 20px;
  }

  &--medium &__label {
    padding: 17px 10px 17px 20px;
  }

  &--disabled &__label {
    border-color: $gray9;
    background: $gray9;
  }

  &.field-skeleton &__label {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
