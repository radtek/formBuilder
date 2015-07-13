
/*global util:true, moment:true */
(function($) {
	"use strict";

$.widget("add123.dateTimeRangePicker", {
	_dateTimeRangePickerTemplate:
				'<div class="date-range-picker form">' +
					'<input type="text" name="from" data-type="dateTime" data-label="'+util.lang.dict.from+'" style="width: 215px;"/>' +
					'<input type="text" name="to" data-type="dateTime" data-label="'+util.lang.dict.to+'" style="width: 215px;"/>' +

					'<button class="previous-range">&lt;&lt;</button>' +

					'<div class="input-field-group range-select">' +
						'<select name="range" style="width: 138px;">' +
							'<option value="custom">'+util.lang.dict.custom+'</option>' +
							'<option value="day">'+util.lang.dict.day+'</option>' +
							'<option value="week">'+util.lang.dict.week+'</option>' +
							'<option value="month">'+util.lang.dict.month+'</option>' +
							'<option value="year">'+util.lang.dict.year+'</option>' +
						'</select>' +
					'</div>' +

					'<button class="next-range">&gt;&gt;</button>' +
				'</div>',
				
		_create: function () {
			var self = this,
				e = self.element;

			var form = self.form = $('<div></div>').html(self._dateTimeRangePickerTemplate).find('.date-range-picker').formBuilder();

			e.append(form);

			self.fromDate = form.find('input[name="from"]').on('keyup ondateselect', function () {
				$(self.range).val('custom');
			});
			self.fromDate.inputField('setLabel', e.attr('data-from-label'));

			self.toDate = form.find('input[name="to"]').on('keyup ondateselect', function () {
				$(self.range).val('custom');
			});
			self.toDate.inputField('setLabel', e.attr('data-to-label'));

			form.find('button.previous-range').button().on('click', function () {
				self._moveRange(-1, $(self.range).val());
			});

			form.find('button.next-range').button().on('click', function () {
				self._moveRange(1, $(self.range).val());
			});

			self.range = form.find('select[name="range"]').on('change', function () {
				self.setRange($(this).val());
			});
		},

		_moveRange: function (number, unit) {
			var self = this,
				fromDate = self.fromDate.inputField('get');

			if (!fromDate || unit === 'custom') {
				return;
			}

			fromDate = self.deserialize(fromDate);

			var begin = fromDate.add(number, unit);
			var end = moment(begin).add(1, unit);

			self._setFromAndTo(begin, end);
		},

		setRange: function (range) {
			var self = this;
			if (range === 'custom') {
				return;
			}

			var fromDate = self.fromDate.inputField('get');

			if (!fromDate) {
				fromDate = moment();
			}

			if (typeof fromDate === 'string') {
				fromDate = self.deserialize(fromDate);
			}

			var from = fromDate;
			var to = moment(from).add(1, range);

			self._setFromAndTo(from, to);
		},

		_setFromAndTo: function (from, to) {
			var self = this;

			if (typeof from !== 'string') {
				from = self.serialize(from);
			}
			if (typeof to !== 'string') {
				to = self.serialize(to);
			}

			self.fromDate.inputField('set', from);
			self.toDate.inputField('set', to);
		},

		serialize: function (date) {
			if (!date) {
				return;
			}

			return date.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z';
		},

		deserialize: function (string) {
			if (!string) {
				return;
			}

			return moment.utc(string);
		},

		get: function () {
			var self = this;

			return self.form.formBuilder('get');
		},

		set: function (data) {
			var self = this;

			self.form.formBuilder('set', data);
		},

		isDirty: function () {
			return this.form.formBuilder('isDirty');
		},

		clearDirty: function () {
			var self = this;

			self.form.formBuilder('clearDirty');
		},

		clear: function () {
			var self = this;

			self.set();
		},

		validate: function () {
			var self = this,
				e = self.element,
				form = self.form;

			if (!form.formBuilder('validate')) {
				return false;
			}
		}
	});

}(jQuery));