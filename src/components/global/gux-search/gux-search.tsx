import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch,
  State
} from '@stencil/core';

@Component({
  styleUrl: 'gux-search.less',
  tag: 'gux-search'
})
export class GuxSearch {
  @Element()
  root: HTMLStencilElement;

  /**
   * Indicate the input search value
   */
  @Prop({ mutable: true, reflectToAttr: true })
  value: string = '';

  /**
   * Disable the input and prevent interactions.
   */
  @Prop()
  disabled: boolean = false;

  /**
   * The input placeholder.
   */
  @Prop()
  placeholder: string;

  /**
   * Operate the search control using dynamic searching
   * as the input value is updated.  Searches debounced
   * to execute every searchTimeout.
   */
  @Prop()
  dynamicSearch: boolean = false;

  /**
   * Timeout between input and search.
   */
  @Prop()
  searchTimeout: number = 500;

  /**
   * Triggered when a search is requested.
   */
  @Event()
  search: EventEmitter;

  /**
   * Triggered when the user inputs data into the control.
   * @return The input value.
   */
  @Event()
  input: EventEmitter;

  @State()
  timeout: number;

  @Watch('value')
  watchValue() {
    if (!this.dynamicSearch) {
      return;
    }

    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this._emitSearch();
    }, this.searchTimeout);
  }

  render() {
    return (
      <div>
        <div class="search-input">
          <gux-text-field
            value={this.value}
            disabled={this.disabled}
            placeholder={this.placeholder}
            onInput={e => this._onInput(e)}
            onKeyDown={e => this._onKeyDown(e)}
          />
          <div class="search-icon">
            <i class="genesys-icon-search" />
          </div>
        </div>
      </div>
    );
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this._emitSearch();
    }
  }

  private _onInput(event: any) {
    this.value = event.target.value;
    this.input.emit(event);
  }

  private _emitSearch() {
    this.search.emit(this.value);
  }
}
