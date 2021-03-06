import Ember from 'ember';

export default Ember.Mixin.create({
  mustUpdateInput: true,
  value: null,
  // add the observed properties
  minViewMode: undefined,
  maxViewMode: undefined,
  format: undefined,
  language: undefined,
  startDate: undefined,
  endDate: undefined,
  setDate: undefined,
  nextArrowIcon: '&#10095',
  prevArrowIcon: '&#10094',

  setupBootstrapDatepicker: Ember.on('didInsertElement', function() {
    var self = this;

    this.$().
      datepicker({
        autoclose: this.get('autoclose'),
        calendarWeeks: this.get('calendarWeeks'),
        clearBtn: this.get('clearBtn'),
        container: this.get('widgetContainer'),
        daysOfWeekDisabled: this.get('daysOfWeekDisabled'),
        defaultViewDate: this.get('defaultViewDate'),
        disableTouchKeyboard: this.get('disableTouchKeyboard'),
        enableOnReadonly: this.get('enableOnReadonly'),
        endDate: this.get('endDate'),
        forceParse: this.get('forceParse'),
        format: this.get('format'),
        immediateUpdates: this.get('immediateUpdates'),
        keyboardNavigation: this.get('keyboardNavigation'),
        language: this.get('language') || undefined,
        maxViewMode: this.get('maxViewMode'),
        minViewMode: this.get('minViewMode'),
        multidate: this.get('multidate'),
        multidateSeparator: this.get('multidateSeparator'),
        orientation: this.get('orientation'),
        showOnFocus: this.get('showOnFocus'),
        startDate: this.get('startDate'),
        startView: this.get('startView'),
        todayBtn: this.get('todayBtn'),
        todayHighlight: this.get('todayHighlight'),
        toggleActive: this.get('toggleActive'),
        weekStart: this.get('weekStart'),
        datesDisabled: this.get('datesDisabled'),
        datesHighlighted : this.get('datesHighlighted'),
        templates : {
          leftArrow: this.get('prevArrowIcon'),
          rightArrow: this.get('nextArrowIcon')
        },
        beforeShowDay: function (date) {
            var dmy;
            var flag = false;
            var enabled = false;
            var tooltip = '';
            if((this.format === 'mm/dd/yyyy' || this.format === 'MM/DD/YYYY') && this.datesHighlighted) {
              dmy = (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear();
              this.datesHighlighted.forEach(function(dateSelectedForHighlight) {
                var higlightDate = new Date(dateSelectedForHighlight.date);
                var newDateFormat = (higlightDate.getMonth()+1) + '-' + higlightDate.getDate() + '-' + higlightDate.getFullYear();
                dateSelectedForHighlight.date = newDateFormat;
                if(dateSelectedForHighlight.date === dmy) {
                  flag = true;
                  dateSelectedForHighlight.enabled === true ? enabled = true : enabled = false;
                  tooltip = dateSelectedForHighlight.tooltip
                }
              });
            } else if((this.format === 'dd/mm/yyyy' || this.format === 'DD/MM/YYYY') && this.datesHighlighted) {
              dmy = (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear();
              this.datesHighlighted.forEach(function(dateSelectedForHighlight) {
                var higlightDate = new Date(dateSelectedForHighlight.date);
                var newDateFormat = (higlightDate.getMonth()+1) + '-' + higlightDate.getDate() + '-' + higlightDate.getFullYear();
                dateSelectedForHighlight.date = newDateFormat;
                if(dateSelectedForHighlight.date === dmy) {
                  flag = true;
                  dateSelectedForHighlight.enabled === true ? enabled = true : enabled = false;
                  tooltip = dateSelectedForHighlight.tooltip
                }
              });
            }

            if(flag) {
              return {
                enabled: enabled,
                classes: 'highlighted',
                tooltip: tooltip
              };
            }
        },
      }).
      on('changeDate', function(event) {
        Ember.run(function() {
          self._didChangeDate(event);
        });
      }).
      on('input', function() {
        if (!self.$().val()) {
          self.set('value', null);
        }
      });

    this._updateDatepicker();
  }),

  teardownBootstrapDatepicker: Ember.on('willDestroyElement', function() {
    this.$().datepicker('remove');
  }),

  didChangeValue: Ember.observer('value', function(value) {
    this.sendAction('inputChanged', value);
    this._updateDatepicker();
  }),

  _didChangeDate: function(event) {
    var value = null;

    if (event.date) {
      if (this.get('multidate')) {
        value = this.$().datepicker('getDates');
      } else {
        value = this.$().datepicker('getDate');
      }
    }

    this.set('mustUpdateInput', false);
    this.set('value', value);
    this.sendAction('changeDate', value);
  },

  _addObservers: Ember.on('didInsertElement', function() {
    this.addObserver('language', function() {
      this.$().datepicker('remove');
      this.setupBootstrapDatepicker();
    });

    this.addObserver('startDate', function() {
      this.$().datepicker('setStartDate', this.get('startDate'));
      this._updateDatepicker();
    });

    this.addObserver('endDate', function() {
      this.$().datepicker('setEndDate', this.get('endDate'));
      this._updateDatepicker();
    });

    this.addObserver('datesDisabled', function() {
      this.$().datepicker('setDatesDisabled', this.get('datesDisabled'));
      this._updateDatepicker();
    });

    this.addObserver('minViewMode', function() {
      this.$().datepicker('minViewMode', this.get('minViewMode'));
      this.$().data('datepicker')._process_options({minViewMode: this.get('minViewMode')});
      this._updateDatepicker();
    });

    this.addObserver('maxViewMode', function() {
      this.$().datepicker('maxViewMode', this.get('maxViewMode'));
      this.$().data('datepicker')._process_options({maxViewMode: this.get('maxViewMode')});
      this._updateDatepicker();
    });

    this.addObserver('format', function() {
      this.$().datepicker('format', this.get('format'));
      this.$().data('datepicker')._process_options({format: this.get('format')});
      this._updateDatepicker();
    });

    if(this.get('setDate')) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        var value = null;
        if(this.format === 'mm/dd/yyyy' || this.format === 'MM/DD/YYYY') {
          value = new Date(this.get('setDate'));
        } else if(this.format === 'dd/mm/yyyy' || this.format === 'DD/MM/YYYY') {
          var setDate = this.get('setDate').split("/");
          value = new Date(setDate[2], setDate[1] - 1, setDate[0]);
        }
        this.set('mustUpdateInput', false);
        this.set('value', value);
        this.sendAction('changeDate', value);
      });
    }
  }),

  _updateDatepicker: function() {
    var self = this,
        element = this.$(),
        value = this.get('value'),
        dates = [];

    if (!this.get('mustUpdateInput')) {
      this.set('mustUpdateInput', true);
      return;
    }

    switch (Ember.typeOf(value)) {
      case 'array':
        dates = value;
        break;
      case 'date':
        dates = [value];
        break;
      default:
        dates = [null];
    }
    dates = dates.map(function(date) {
      return (Ember.isNone(date)) ? null : self._getDateCloneWithNoTime(date);
    });

    element.datepicker
           .apply(element, Array.prototype.concat.call(['update'], dates));
  },

  // HACK: Have to reset time to 00:00:00 because of the bug in
  //       bootstrap-datepicker
  //       Issue: http://git.io/qH7Hlg
  _getDateCloneWithNoTime: function(date) {
    var clone = new Date(date.getTime());

    clone.setHours(0);
    clone.setMinutes(0);
    clone.setSeconds(0);
    clone.setMilliseconds(0);

    return clone;
  }
});
