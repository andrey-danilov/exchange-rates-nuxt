<template>
  <div
    :tabindex="searchable ? -1 : tabindex"
    :class="{
      'multiselect--active': isOpen,
      'multiselect--disabled': disabled,
      'multiselect--above': isAbove,
      'multiselect--small': small,
      'multiselect--no-borders': noBorders,
      'multiselect--filled': value,
      'field-skeleton': prepare,
    }"
    class="multiselect"
    @focus="activate()"
    @blur="searchable ? false : deactivate()"
    @keydown.self.down.prevent="pointerForward()"
    @keydown.self.up.prevent="pointerBackward()"
    @keypress.enter.tab.stop.self="addPointerElement($event)"
    @keyup.esc="deactivate()"
  >
    <slot name="clear" :search="search"></slot>
    <div
      ref="tags"
      class="multiselect__tags"
      :class="{ 'multiselect__tags--multiple': multiple }"
    >
      <slot
        name="selection"
        :search="search"
        :remove="removeElement"
        :values="visibleValues"
        :is-open="isOpen"
      >
        <div
          v-show="visibleValues.length && !isOpen"
          class="multiselect__tags-wrap"
        >
          <template v-for="(option, index) of visibleValues">
            <slot
              name="tag"
              :option="option"
              :search="search"
              :remove="removeElement"
            >
              <span :key="index" class="multiselect__tag">
                <slot name="tag-label" :option="option">
                  <span v-text="getOptionLabel(option)"></span>
                </slot>
                <button
                  aria-hidden="true"
                  tabindex="1"
                  class="multiselect__tag-icon"
                  @keypress.enter.prevent="removeElement(option)"
                  @mousedown.prevent="removeElement(option)"
                >
                  <!--                    <svg-icon name="close"  />-->
                </button>
              </span>
            </slot>
          </template>
        </div>
        <template v-if="internalValue && internalValue.length > limit">
          <slot name="limit">
            <strong
              class="multiselect__strong"
              v-text="limitText(internalValue.length - limit)"
            />
          </slot>
        </template>
      </slot>
      <transition name="spinner-transition">
        <slot name="loading"></slot>
      </transition>
      <input
        v-if="searchable"
        :id="id"
        ref="search"
        v-mask="mask"
        :name="name"
        type="text"
        autocomplete="nope"
        :placeholder="placeholder"
        :style="inputStyle"
        :value="search"
        :disabled="disabled"
        :tabindex="tabindex"
        class="multiselect__input"
        @input="updateSearch($event.target.value)"
        @focus.prevent="activate()"
        @blur.prevent="deactivate()"
        @keyup.esc="deactivate()"
        @keydown.down.prevent="pointerForward()"
        @keydown.up.prevent="pointerBackward()"
        @keypress.enter.prevent.stop.self="addPointerElement($event)"
        @keydown.delete.stop="removeLastElement()"
      />
      <span
        v-if="isSingleLabelVisible"
        class="multiselect__single"
        @mousedown.prevent="toggle"
      >
        <slot name="singleLabel" :option="singleValue">
          <template ref="currentOptionLabel">{{ currentOptionLabel }}</template>
        </slot>
      </span>
      <span
        v-if="isPlaceholderVisible"
        class="multiselect__placeholder"
        @mousedown.prevent="toggle"
      >
        <slot name="placeholder">
          {{ placeholder }}
        </slot>
      </span>
      <slot name="caret" :toggle="toggle">
        <div class="multiselect__select" @mousedown.prevent.stop="toggle()">
          <!--          <svg-icon name="chevron" width="16px" height="16px" />-->
        </div>
      </slot>
    </div>
    <transition name="multiselect">
      <div
        v-show="isOpen"
        ref="list"
        class="multiselect__content-wrapper"
        tabindex="-1"
        :style="{ maxHeight: optimizedHeight + 'px' }"
        @focus="activate"
        @mousedown.prevent
      >
        <ul class="multiselect__content" :style="contentStyle">
          <slot name="beforeList"></slot>
          <li v-if="multiple && max === internalValue.length">
            <span class="multiselect__option">
              <slot name="maxElements">
                Maximum of {{ max }} options selected. First remove a selected
                option to select another.
              </slot>
            </span>
          </li>
          <template v-if="!max || internalValue.length < max">
            <li
              v-for="(option, index) of filteredOptions"
              :key="index"
              class="multiselect__element"
            >
              <span
                v-if="!(option && (option.$isLabel || option.$isDisabled))"
                :class="optionHighlight(index, option)"
                :data-select="
                  option && option.isTag ? tagPlaceholder : selectLabelText
                "
                :data-selected="selectedLabelText"
                :data-deselect="deselectLabelText"
                class="multiselect__option"
                @click.stop="select(option)"
                @mouseenter.self="pointerSet(index)"
              >
                <template v-if="multiple">
                  <slot
                    name="option"
                    :option="option"
                    :search="search"
                    :is-selected="isSelected(option)"
                  >
                    <t-checkbox
                      class="multiselect__element-checkbox"
                      :name="safeId(`multiselect-option_${index}`)"
                      :value="isSelected(option)"
                      :label="getOptionLabel(option)"
                    />
                  </slot>
                </template>
                <template v-else>
                  <slot name="option" :option="option" :search="search">
                    <span>{{ getOptionLabel(option) }}</span>
                  </slot>
                </template>
              </span>
              <span
                v-if="option && (option.$isLabel || option.$isDisabled)"
                :data-select="groupSelect && selectGroupLabelText"
                :data-deselect="groupSelect && deselectGroupLabelText"
                :class="groupHighlight(index, option)"
                class="multiselect__option"
                @mouseenter.self="groupSelect && pointerSet(index)"
                @mousedown.prevent="selectGroup(option)"
              >
                <slot name="option" :option="option" :search="search">
                  <span>{{ getOptionLabel(option) }}</span>
                </slot>
              </span>
            </li>
          </template>
          <li
            v-show="
              showNoResults &&
              filteredOptions.length === 0 &&
              search &&
              !loading
            "
          >
            <span class="multiselect__option">
              <slot name="noResult" :search="search"> no elements found </slot>
            </span>
          </li>
          <li
            v-show="
              showNoOptions && options.length === 0 && !search && !loading
            "
          >
            <span class="multiselect__option">
              <slot name="noOptions">empty select</slot>
            </span>
          </li>
          <slot name="afterList"></slot>
        </ul>
      </div>
    </transition>
    <p v-if="fieldLabel" class="multiselect__label">
      {{ fieldLabel }}
      <span v-if="required" class="required-identifier">*</span>
    </p>
  </div>
</template>

<script>
import multiselectMixin from './multiselectMixin'
import pointerMixin from './pointerMixin'
import safeId from '@/mixins/safe-id'

export default {
  name: 'TMultiselect',
  mixins: [multiselectMixin, pointerMixin, safeId],
  props: {
    /**
     * name attribute to match optional label element
     * @default ''
     * @type {String}
     */
    name: {
      type: String,
      default: '',
    },
    /**
     * String to show when pointing to an option
     * @default 'Press enter to select'
     * @type {String}
     */
    selectLabel: {
      type: String,
      default: 'Press enter to select',
    },
    /**
     * String to show when pointing to an option
     * @default 'Press enter to select'
     * @type {String}
     */
    selectGroupLabel: {
      type: String,
      default: 'Press enter to select group',
    },
    /**
     * String to show next to selected option
     * @default 'Selected'
     * @type {String}
     */
    selectedLabel: {
      type: String,
      default: 'Selected',
    },
    /**
     * String to show when pointing to an already selected option
     * @default 'Press enter to remove'
     * @type {String}
     */
    deselectLabel: {
      type: String,
      default: 'Press enter to remove',
    },
    /**
     * String to show when pointing to an already selected option
     * @default 'Press enter to remove'
     * @type {String}
     */
    deselectGroupLabel: {
      type: String,
      default: 'Press enter to deselect group',
    },
    /**
     * Decide whether to show pointer labels
     * @default true
     * @type {Boolean}
     */
    showLabels: {
      type: Boolean,
      default: true,
    },
    /**
     * Limit the display of selected options. The rest will be hidden within the limitText string.
     * @default 99999
     * @type {Integer}
     */
    limit: {
      type: Number,
      default: 99999,
    },
    /**
     * Sets maxHeight style value of the dropdown
     * @default 300
     * @type {Integer}
     */
    maxHeight: {
      type: Number,
      default: 300,
    },
    /**
     * Function that process the message shown when selected
     * elements pass the defined limit.
     * @default 'and * more'
     * @param {Int} count Number of elements more than limit
     * @type {Function}
     */
    limitText: {
      type: Function,
      default: (count) => `and ${count} more`,
    },
    /**
     * Set true to trigger the loading spinner.
     * @default False
     * @type {Boolean}
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * Disables the multiselect if true.
     * @default false
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Fixed opening direction
     * @default ''
     * @type {String}
     */
    openDirection: {
      type: String,
      default: '',
    },
    /**
     * Shows slot with message about empty options
     * @default true
     * @type {Boolean}
     */
    showNoOptions: {
      type: Boolean,
      default: true,
    },
    showNoResults: {
      type: Boolean,
      default: true,
    },
    tabindex: {
      type: Number,
      default: 0,
    },
    small: Boolean,
    noBorders: Boolean,
    multiple: Boolean,
    fieldLabel: {
      type: String,
      default() {
        return ''
      },
    },
    mask: {
      type: String,
      default() {
        return ''
      },
    },
    prepare: Boolean,
    required: Boolean,
  },
  computed: {
    isSingleLabelVisible() {
      return (
        (this.singleValue || this.singleValue === 0) &&
        (!this.isOpen || !this.searchable) &&
        !this.visibleValues.length
      )
    },
    isPlaceholderVisible() {
      return !this.internalValue.length && (!this.searchable || !this.isOpen)
    },
    visibleValues() {
      return this.multiple ? this.internalValue.slice(0, this.limit) : []
    },
    singleValue() {
      return this.internalValue[0]
    },
    deselectLabelText() {
      return this.showLabels ? this.deselectLabel : ''
    },
    deselectGroupLabelText() {
      return this.showLabels ? this.deselectGroupLabel : ''
    },
    selectLabelText() {
      return this.showLabels ? this.selectLabel : ''
    },
    selectGroupLabelText() {
      return this.showLabels ? this.selectGroupLabel : ''
    },
    selectedLabelText() {
      return this.showLabels ? this.selectedLabel : ''
    },
    inputStyle() {
      if (
        this.searchable ||
        (this.multiple && this.value && this.value.length)
      ) {
        // Hide input by setting the width to 0 allowing it to receive focus
        return this.isOpen
          ? { width: '100%' }
          : { width: '0', position: 'absolute', padding: '0' }
      }

      return null
    },
    contentStyle() {
      return this.options.length
        ? { display: 'inline-block' }
        : { display: 'block' }
    },
    isAbove() {
      if (this.openDirection === 'above' || this.openDirection === 'top') {
        return true
      } else if (
        this.openDirection === 'below' ||
        this.openDirection === 'bottom'
      ) {
        return false
      }

      return this.preferredOpenDirection === 'above'
    },
    showSearchInput() {
      return (
        this.searchable &&
        (this.hasSingleSelectedSlot &&
        (this.visibleSingleValue || this.visibleSingleValue === 0)
          ? this.isOpen
          : true)
      )
    },
  },
}
</script>

<style lang="scss">
fieldset[disabled] .multiselect {
  pointer-events: none;
}

.multiselect,
.multiselect__input,
.multiselect__single {
  font-family: inherit;
  font-size: 16px;
  touch-action: manipulation;
}

.multiselect {
  box-sizing: content-box;
  display: block;
  position: relative;
  min-height: 40px;
  text-align: left;
  color: $gray1;
}

.multiselect * {
  box-sizing: border-box;
}

.multiselect:focus {
  outline: none;
}

.multiselect--disabled {
  pointer-events: none;
}

.multiselect--disabled .multiselect__tags {
  border-color: $gray9;
}

.multiselect--active {
  z-index: 50;
}

.multiselect--active .multiselect__select {
  transform: rotate(180deg);
}

.multiselect__input,
.multiselect__single {
  position: relative;
  display: inline-block;
  min-height: 20px;
  border: none;
  border-radius: 5px;
  background: #fff;
  width: calc(100%);
  transition: border 0.1s ease;
  box-sizing: border-box;
  vertical-align: top;

  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
}

.multiselect__input::placeholder {
  color: $gray1;
}

.multiselect__tag ~ .multiselect__input,
.multiselect__tag ~ .multiselect__single {
  width: auto;
}

.multiselect__input:hover,
.multiselect__single:hover {
  border-color: #cfcfcf;
}

.multiselect__input:focus,
.multiselect__single:focus {
  border-color: #a8a8a8;
  outline: none;
}

.multiselect__tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.multiselect__tags {
  min-height: 40px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: 1px solid $gray7;
  background: #fff;
  font-size: 14px;
  color: $gray1;
  padding: 12px 20px;
  transition-property: border;
  transition-duration: 0.3s;

  &--multiple {
    min-height: 48px;
    padding: 9px 20px;
  }
}
.multiselect--small .multiselect__tags {
  padding: 0 20px;
  border-width: 2px;
}

.multiselect--filled:not(.multiselect--small) .multiselect__tags {
  border-color: $greenish;
}

.multiselect--no-borders .multiselect__tags {
  border: none;
  padding: 0 8px;
}

.multiselect--active .multiselect__tags {
  border-color: $greenish;
}

.multiselect__tag {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;

  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  letter-spacing: 0.2px;

  border-radius: 4px;
  margin-right: 10px;
  color: $gray1;
  background: $gray6;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
}

.multiselect__tag-icon {
  border: none;
  height: 20px;
  margin-left: 10px;

  cursor: pointer;
  font-style: initial;

  transition: all 0.2s ease;
  border-radius: 4px;

  padding: 0;
  &:hover {
    background: $gray9;
  }
}
.multiselect__label {
  white-space: nowrap;
  font-size: 0.86em;
  display: block;
  background: $white;
  position: absolute;
  top: 50%;
  left: 1px;
  transform: translateY(-50%);
  color: $gray1;
  padding: 0 13px;
  pointer-events: none;

  transition-duration: 0.3s;
  border-radius: 10px;
}

.multiselect--active .multiselect__label,
.multiselect--filled .multiselect__label {
  top: 0;
  left: calc(100% - 13px);
  transform: translateY(-50%) translateX(-100%);
  color: $greenish;
}

.multiselect__current {
  line-height: 16px;
  min-height: 40px;
  box-sizing: border-box;
  display: block;
  overflow: hidden;
  padding: 8px 12px 0;
  padding-right: 30px;
  white-space: nowrap;
  margin: 0;
  text-decoration: none;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  cursor: pointer;
}

.multiselect__select {
  display: flex;
  margin-left: auto;
  align-items: center;
  box-sizing: border-box;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.multiselect__placeholder {
  color: $gray1;
  display: inline-block;
  padding-top: 2px;
  font-size: 14px;
  line-height: 20px;
}

.multiselect__content-wrapper {
  position: absolute;
  display: block;
  margin-top: 8px;
  background: #fff;
  width: 100%;
  max-height: 240px;
  overflow: auto;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(37, 40, 43, 0.12);

  z-index: 50;
  -webkit-overflow-scrolling: touch;
}

.multiselect__content {
  list-style: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  min-width: 100%;
  vertical-align: top;
}

.multiselect--above .multiselect__content-wrapper {
  bottom: 100%;
  border-radius: 5px 5px 0 0;
  border-bottom: none;
  border-top: 1px solid #e8e8e8;
}

.multiselect__content::webkit-scrollbar {
  display: none;
}

.multiselect__element {
  display: block;
}

.multiselect__element-checkbox {
  pointer-events: none;
}

.multiselect__option {
  display: flex;
  align-items: center;
  min-height: 40px;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  padding-left: 20px;

  text-decoration: none;
  text-transform: none;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
  white-space: nowrap;
}

.multiselect__option:after {
  top: 0;
  right: 0;
  position: absolute;
  line-height: 40px;
  padding-right: 12px;
  padding-left: 20px;
  font-size: 13px;
}

.multiselect__option--highlight {
  background: $gradient-light;
  outline: none;
}

.multiselect__option--highlight:after {
  content: attr(data-select);
  background: #41b883;
  color: white;
}

.multiselect__option--selected {
  color: $greenish;
}

.multiselect__option--selected:after {
  content: attr(data-selected);
  color: silver;
}

.multiselect__option--selected.multiselect__option--highlight:after {
  background: #ff6a6a;
  content: attr(data-deselect);
  color: #fff;
}

.multiselect--disabled .multiselect__current,
.multiselect--disabled .multiselect__select {
  color: #a6a6a6;
}

.multiselect__option--disabled {
  color: #a6a6a6 !important;
  cursor: text;
  pointer-events: none;
}

.multiselect__option--group {
  background: #ededed;
  color: #35495e;
}

.multiselect__option--group.multiselect__option--highlight {
  background: #35495e;
  color: #fff;
}

.multiselect__option--group.multiselect__option--highlight:after {
  background: #35495e;
}

.multiselect__option--disabled.multiselect__option--highlight {
  background: #dedede;
}

.multiselect__option--group-selected.multiselect__option--highlight {
  background: #ff6a6a;
  color: #fff;
}

.multiselect__option--group-selected.multiselect__option--highlight:after {
  background: #ff6a6a;
  content: attr(data-deselect);
  color: #fff;
}

.multiselect-enter-active,
.multiselect-leave-active {
  transition: all 0.15s ease;
}

.multiselect-enter,
.multiselect-leave-active {
  opacity: 0;
}

.multiselect__strong {
  margin-bottom: 8px;
  line-height: 20px;
  display: inline-block;
  vertical-align: top;
}

*[dir='rtl'] .multiselect {
  text-align: right;
}

*[dir='rtl'] .multiselect__select {
  right: auto;
  left: 1px;
}

*[dir='rtl'] .multiselect__tags {
  padding: 8px 8px 0px 40px;
}

*[dir='rtl'] .multiselect__content {
  text-align: right;
}

*[dir='rtl'] .multiselect__option:after {
  right: auto;
  left: 0;
}

*[dir='rtl'] .multiselect__clear {
  right: auto;
  left: 12px;
}

*[dir='rtl'] .multiselect__spinner {
  right: auto;
  left: 1px;
}

.field-skeleton .multiselect__tags,
.field-skeleton .multiselect__label {
  opacity: 0;
  pointer-events: none;
}

@keyframes spinning {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(2turn);
  }
}
</style>
