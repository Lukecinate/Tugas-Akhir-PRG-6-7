/**
 * TinyMCE version 6.4.2 (2023-04-26)
 */

(function () {
    'use strict';

    var global$3 = tinymce.util.Tools.resolve('tinymce.PluginManager');

    const hasProto = (v, constructor, predicate) => {
      var _a;
      if (predicate(v, constructor.prototype)) {
        return true;
      } else {
        return ((_a = v.constructor) === null || _a === void 0 ? void 0 : _a.name) === constructor.name;
      }
    };
    const typeOf = x => {
      const t = typeof x;
      if (x === null) {
        return 'null';
      } else if (t === 'object' && Array.isArray(x)) {
        return 'array';
      } else if (t === 'object' && hasProto(x, String, (o, proto) => proto.isPrototypeOf(o))) {
        return 'string';
      } else {
        return t;
      }
    };
    const isType = type => value => typeOf(value) === type;
    const isSimpleType = type => value => typeof value === type;
    const isString = isType('string');
    const isObject = isType('object');
    const isArray = isType('array');
    const isNullable = a => a === null || a === undefined;
    const isNonNullable = a => !isNullable(a);
    const isFunction = isSimpleType('function');
    const isArrayOf = (value, pred) => {
      if (isArray(value)) {
        for (let i = 0, len = value.length; i < len; ++i) {
          if (!pred(value[i])) {
            return false;
          }
        }
        return true;
      }
      return false;
    };

    const constant = value => {
      return () => {
        return value;
      };
    };
    function curry(fn, ...initialArgs) {
      return (...restArgs) => {
        const all = initialArgs.concat(restArgs);
        return fn.apply(null, all);
      };
    }
    const never = constant(false);

    const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    var global$2 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    const option = name => editor => editor.options.get(name);
    const register$2 = editor => {
      const registerOption = editor.options.register;
      registerOption('templates_cdate_classes', {
        processor: 'string',
        default: 'cdate'
      });
      registerOption('templates_mdate_classes', {
        processor: 'string',
        default: 'mdate'
      });
      registerOption('templates_selected_content_classes', {
        processor: 'string',
        default: 'selcontent'
      });
      registerOption('templates_preview_replace_values', { processor: 'object' });
      registerOption('templates_replace_values', { processor: 'object' });
      registerOption('templatess', {
        processor: value => isString(value) || isArrayOf(value, isObject) || isFunction(value),
        default: []
      });
      registerOption('templates_cdate_format', {
        processor: 'string',
        default: editor.translate('%Y-%m-%d')
      });
      registerOption('templates_mdate_format', {
        processor: 'string',
        default: editor.translate('%Y-%m-%d')
      });
    };
    const getCreationDateClasses = option('templates_cdate_classes');
    const getModificationDateClasses = option('templates_mdate_classes');
    const getSelectedContentClasses = option('templates_selected_content_classes');
    const getPreviewReplaceValues = option('templates_preview_replace_values');
    const gettemplatesReplaceValues = option('templates_replace_values');
    const gettemplatess = option('templatess');
    const getCdateFormat = option('templates_cdate_format');
    const getMdateFormat = option('templates_mdate_format');
    const getContentStyle = option('content_style');
    const shouldUseContentCssCors = option('content_css_cors');
    const getBodyClass = option('body_class');

    const addZeros = (value, len) => {
      value = '' + value;
      if (value.length < len) {
        for (let i = 0; i < len - value.length; i++) {
          value = '0' + value;
        }
      }
      return value;
    };
    const getDateTime = (editor, fmt, date = new Date()) => {
      const daysShort = 'Sun Mon Tue Wed Thu Fri Sat Sun'.split(' ');
      const daysLong = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ');
      const monthsShort = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
      const monthsLong = 'January February March April May June July August September October November December'.split(' ');
      fmt = fmt.replace('%D', '%m/%d/%Y');
      fmt = fmt.replace('%r', '%I:%M:%S %p');
      fmt = fmt.replace('%Y', '' + date.getFullYear());
      fmt = fmt.replace('%y', '' + date.getYear());
      fmt = fmt.replace('%m', addZeros(date.getMonth() + 1, 2));
      fmt = fmt.replace('%d', addZeros(date.getDate(), 2));
      fmt = fmt.replace('%H', '' + addZeros(date.getHours(), 2));
      fmt = fmt.replace('%M', '' + addZeros(date.getMinutes(), 2));
      fmt = fmt.replace('%S', '' + addZeros(date.getSeconds(), 2));
      fmt = fmt.replace('%I', '' + ((date.getHours() + 11) % 12 + 1));
      fmt = fmt.replace('%p', '' + (date.getHours() < 12 ? 'AM' : 'PM'));
      fmt = fmt.replace('%B', '' + editor.translate(monthsLong[date.getMonth()]));
      fmt = fmt.replace('%b', '' + editor.translate(monthsShort[date.getMonth()]));
      fmt = fmt.replace('%A', '' + editor.translate(daysLong[date.getDay()]));
      fmt = fmt.replace('%a', '' + editor.translate(daysShort[date.getDay()]));
      fmt = fmt.replace('%%', '%');
      return fmt;
    };

    class Optional {
      constructor(tag, value) {
        this.tag = tag;
        this.value = value;
      }
      static some(value) {
        return new Optional(true, value);
      }
      static none() {
        return Optional.singletonNone;
      }
      fold(onNone, onSome) {
        if (this.tag) {
          return onSome(this.value);
        } else {
          return onNone();
        }
      }
      isSome() {
        return this.tag;
      }
      isNone() {
        return !this.tag;
      }
      map(mapper) {
        if (this.tag) {
          return Optional.some(mapper(this.value));
        } else {
          return Optional.none();
        }
      }
      bind(binder) {
        if (this.tag) {
          return binder(this.value);
        } else {
          return Optional.none();
        }
      }
      exists(predicate) {
        return this.tag && predicate(this.value);
      }
      forall(predicate) {
        return !this.tag || predicate(this.value);
      }
      filter(predicate) {
        if (!this.tag || predicate(this.value)) {
          return this;
        } else {
          return Optional.none();
        }
      }
      getOr(replacement) {
        return this.tag ? this.value : replacement;
      }
      or(replacement) {
        return this.tag ? this : replacement;
      }
      getOrThunk(thunk) {
        return this.tag ? this.value : thunk();
      }
      orThunk(thunk) {
        return this.tag ? this : thunk();
      }
      getOrDie(message) {
        if (!this.tag) {
          throw new Error(message !== null && message !== void 0 ? message : 'Called getOrDie on None');
        } else {
          return this.value;
        }
      }
      static from(value) {
        return isNonNullable(value) ? Optional.some(value) : Optional.none();
      }
      getOrNull() {
        return this.tag ? this.value : null;
      }
      getOrUndefined() {
        return this.value;
      }
      each(worker) {
        if (this.tag) {
          worker(this.value);
        }
      }
      toArray() {
        return this.tag ? [this.value] : [];
      }
      toString() {
        return this.tag ? `some(${ this.value })` : 'none()';
      }
    }
    Optional.singletonNone = new Optional(false);

    const exists = (xs, pred) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          return true;
        }
      }
      return false;
    };
    const map = (xs, f) => {
      const len = xs.length;
      const r = new Array(len);
      for (let i = 0; i < len; i++) {
        const x = xs[i];
        r[i] = f(x, i);
      }
      return r;
    };
    const findUntil = (xs, pred, until) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          return Optional.some(x);
        } else if (until(x, i)) {
          break;
        }
      }
      return Optional.none();
    };
    const find = (xs, pred) => {
      return findUntil(xs, pred, never);
    };

    const hasOwnProperty = Object.hasOwnProperty;
    const get = (obj, key) => {
      return has(obj, key) ? Optional.from(obj[key]) : Optional.none();
    };
    const has = (obj, key) => hasOwnProperty.call(obj, key);

    var global$1 = tinymce.util.Tools.resolve('tinymce.html.Serializer');

    const entitiesAttr = {
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '\'': '&#039;'
    };
    const htmlEscape = html => html.replace(/["'<>&]/g, match => get(entitiesAttr, match).getOr(match));
    const hasAnyClasses = (dom, n, classes) => exists(classes.split(/\s+/), c => dom.hasClass(n, c));
    const parseAndSerialize = (editor, html) => global$1({ validate: true }, editor.schema).serialize(editor.parser.parse(html, { insert: true }));

    const createtemplatesList = (editor, callback) => {
      return () => {
        const templatesList = gettemplatess(editor);
        if (isFunction(templatesList)) {
          templatesList(callback);
        } else if (isString(templatesList)) {
          fetch(templatesList).then(res => {
            if (res.ok) {
              res.json().then(callback);
            }
          });
        } else {
          callback(templatesList);
        }
      };
    };
    const replacetemplatesValues = (html, templatesValues) => {
      global$2.each(templatesValues, (v, k) => {
        if (isFunction(v)) {
          v = v(k);
        }
        html = html.replace(new RegExp('\\{\\$' + escape(k) + '\\}', 'g'), v);
      });
      return html;
    };
    const replaceVals = (editor, scope) => {
      const dom = editor.dom, vl = gettemplatesReplaceValues(editor);
      global$2.each(dom.select('*', scope), e => {
        global$2.each(vl, (v, k) => {
          if (dom.hasClass(e, k)) {
            if (isFunction(v)) {
              v(e);
            }
          }
        });
      });
    };
    const inserttemplates = (editor, _ui, html) => {
      const dom = editor.dom;
      const sel = editor.selection.getContent();
      html = replacetemplatesValues(html, gettemplatesReplaceValues(editor));
      let el = dom.create('div', {}, parseAndSerialize(editor, html));
      const n = dom.select('.mceTmpl', el);
      if (n && n.length > 0) {
        el = dom.create('div');
        el.appendChild(n[0].cloneNode(true));
      }
      global$2.each(dom.select('*', el), n => {
        if (hasAnyClasses(dom, n, getCreationDateClasses(editor))) {
          n.innerHTML = getDateTime(editor, getCdateFormat(editor));
        }
        if (hasAnyClasses(dom, n, getModificationDateClasses(editor))) {
          n.innerHTML = getDateTime(editor, getMdateFormat(editor));
        }
        if (hasAnyClasses(dom, n, getSelectedContentClasses(editor))) {
          n.innerHTML = sel;
        }
      });
      replaceVals(editor, el);
      editor.execCommand('mceInsertContent', false, el.innerHTML);
      editor.addVisual();
    };

    var global = tinymce.util.Tools.resolve('tinymce.Env');

    const getPreviewContent = (editor, html) => {
      var _a;
      if (html.indexOf('<html>') === -1) {
        let contentCssEntries = '';
        const contentStyle = (_a = getContentStyle(editor)) !== null && _a !== void 0 ? _a : '';
        const cors = shouldUseContentCssCors(editor) ? ' crossorigin="anonymous"' : '';
        global$2.each(editor.contentCSS, url => {
          contentCssEntries += '<link type="text/css" rel="stylesheet" href="' + editor.documentBaseURI.toAbsolute(url) + '"' + cors + '>';
        });
        if (contentStyle) {
          contentCssEntries += '<style type="text/css">' + contentStyle + '</style>';
        }
        const bodyClass = getBodyClass(editor);
        const encode = editor.dom.encode;
        const isMetaKeyPressed = global.os.isMacOS() || global.os.isiOS() ? 'e.metaKey' : 'e.ctrlKey && !e.altKey';
        const preventClicksOnLinksScript = '<script>' + 'document.addEventListener && document.addEventListener("click", function(e) {' + 'for (var elm = e.target; elm; elm = elm.parentNode) {' + 'if (elm.nodeName === "A" && !(' + isMetaKeyPressed + ')) {' + 'e.preventDefault();' + '}' + '}' + '}, false);' + '</script> ';
        const directionality = editor.getBody().dir;
        const dirAttr = directionality ? ' dir="' + encode(directionality) + '"' : '';
        html = '<!DOCTYPE html>' + '<html>' + '<head>' + '<base href="' + encode(editor.documentBaseURI.getURI()) + '">' + contentCssEntries + preventClicksOnLinksScript + '</head>' + '<body class="' + encode(bodyClass) + '"' + dirAttr + '>' + parseAndSerialize(editor, html) + '</body>' + '</html>';
      }
      return replacetemplatesValues(html, getPreviewReplaceValues(editor));
    };
    const open = (editor, templatesList) => {
      const createtemplatess = () => {
        if (!templatesList || templatesList.length === 0) {
          const message = editor.translate('No templatess defined.');
          editor.notificationManager.open({
            text: message,
            type: 'info'
          });
          return Optional.none();
        }
        return Optional.from(global$2.map(templatesList, (templates, index) => {
          const isUrltemplates = t => t.url !== undefined;
          return {
            selected: index === 0,
            text: templates.title,
            value: {
              url: isUrltemplates(templates) ? Optional.from(templates.url) : Optional.none(),
              content: !isUrltemplates(templates) ? Optional.from(templates.content) : Optional.none(),
              description: templates.description
            }
          };
        }));
      };
      const createSelectBoxItems = templatess => map(templatess, t => ({
        text: t.text,
        value: t.text
      }));
      const findtemplates = (templatess, templatesTitle) => find(templatess, t => t.text === templatesTitle);
      const loadFailedAlert = api => {
        editor.windowManager.alert('Could not load the specified templates.', () => api.focus('templates'));
      };
      const gettemplatesContent = t => t.value.url.fold(() => Promise.resolve(t.value.content.getOr('')), url => fetch(url).then(res => res.ok ? res.text() : Promise.reject()));
      const onChange = (templatess, updateDialog) => (api, change) => {
        if (change.name === 'templates') {
          const newtemplatesTitle = api.getData().templates;
          findtemplates(templatess, newtemplatesTitle).each(t => {
            api.block('Loading...');
            gettemplatesContent(t).then(previewHtml => {
              updateDialog(api, t, previewHtml);
            }).catch(() => {
              updateDialog(api, t, '');
              api.setEnabled('save', false);
              loadFailedAlert(api);
            });
          });
        }
      };
      const onSubmit = templatess => api => {
        const data = api.getData();
        findtemplates(templatess, data.templates).each(t => {
          gettemplatesContent(t).then(previewHtml => {
            editor.execCommand('mceInserttemplates', false, previewHtml);
            api.close();
          }).catch(() => {
            api.setEnabled('save', false);
            loadFailedAlert(api);
          });
        });
      };
      const openDialog = templatess => {
        const selectBoxItems = createSelectBoxItems(templatess);
        const buildDialogSpec = (bodyItems, initialData) => ({
          title: 'Insert templates',
          size: 'large',
          body: {
            type: 'panel',
            items: bodyItems
          },
          initialData,
          buttons: [
            {
              type: 'cancel',
              name: 'cancel',
              text: 'Cancel'
            },
            {
              type: 'submit',
              name: 'save',
              text: 'Save',
              primary: true
            }
          ],
          onSubmit: onSubmit(templatess),
          onChange: onChange(templatess, updateDialog)
        });
        const updateDialog = (dialogApi, templates, previewHtml) => {
          const content = getPreviewContent(editor, previewHtml);
          const bodyItems = [
            {
              type: 'selectbox',
              name: 'templates',
              label: 'templatess',
              items: selectBoxItems
            },
            {
              type: 'htmlpanel',
              html: `<p aria-live="polite">${ htmlEscape(templates.value.description) }</p>`
            },
            {
              label: 'Preview',
              type: 'iframe',
              name: 'preview',
              sandboxed: false,
              transparent: false
            }
          ];
          const initialData = {
            templates: templates.text,
            preview: content
          };
          dialogApi.unblock();
          dialogApi.redial(buildDialogSpec(bodyItems, initialData));
          dialogApi.focus('templates');
        };
        const dialogApi = editor.windowManager.open(buildDialogSpec([], {
          templates: '',
          preview: ''
        }));
        dialogApi.block('Loading...');
        gettemplatesContent(templatess[0]).then(previewHtml => {
          updateDialog(dialogApi, templatess[0], previewHtml);
        }).catch(() => {
          updateDialog(dialogApi, templatess[0], '');
          dialogApi.setEnabled('save', false);
          loadFailedAlert(dialogApi);
        });
      };
      const opttemplatess = createtemplatess();
      opttemplatess.each(openDialog);
    };

    const showDialog = editor => templatess => {
      open(editor, templatess);
    };
    const register$1 = editor => {
      editor.addCommand('mceInserttemplates', curry(inserttemplates, editor));
      editor.addCommand('mcetemplates', createtemplatesList(editor, showDialog(editor)));
    };

    const setup = editor => {
      editor.on('PreProcess', o => {
        const dom = editor.dom, dateFormat = getMdateFormat(editor);
        global$2.each(dom.select('div', o.node), e => {
          if (dom.hasClass(e, 'mceTmpl')) {
            global$2.each(dom.select('*', e), e => {
              if (hasAnyClasses(dom, e, getModificationDateClasses(editor))) {
                e.innerHTML = getDateTime(editor, dateFormat);
              }
            });
            replaceVals(editor, e);
          }
        });
      });
    };

    const register = editor => {
      const onAction = () => editor.execCommand('mcetemplates');
      editor.ui.registry.addButton('templates', {
        icon: 'templates',
        tooltip: 'Insert templates',
        onAction
      });
      editor.ui.registry.addMenuItem('templates', {
        icon: 'templates',
        text: 'Insert templates...',
        onAction
      });
    };

    var Plugin = () => {
      global$3.add('templates', editor => {
        register$2(editor);
        register(editor);
        register$1(editor);
        setup(editor);
      });
    };

    Plugin();

})();
