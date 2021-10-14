import { am as extractCallback, d as MODEL_CHAIN_PREFIX, e as TRANSLATION_CHAIN_PREFIX, G as EVENT_MODEL_GET, N as EVENT_TRANSLATION_MODEL_GET, O as EVENT_PARENT_CHAIN_GET, K as EVENT_TAGS_GET, J as EVENT_ROUTING_GET, af as URLHelper, ak as getSkinFromState, ah as loadJS, al as getSkinPathFromState, a as SCRIPTS_PATH, ai as loadJSON, R as setElementValue, F as FOR_ATTRIBUTE, a2 as getCompleteChain, l as FOR_OPTIONS, m as FOR_EVENTS, n as FOR_OPTIMISTIC, o as FOR_WRAPPER_RERENDER, an as listenForPrefixChainEvents, k as FOR_NO_DATA_SLOT_NAME, a8 as removeChangeHandler, a1 as removeElementChildNodes, W as removeSlotInfoFromElement, ab as createDomMap, ac as diffDomMap, p as FOR_CONTENT_UPDATED_EVENT, q as FOR_CONTENT_REPLACED_EVENT, U as bindElementAttributes, a6 as setElementChainChangeHandler, a7 as setElementExpressionChangeHandler, I as IF_ATTRIBUTE, _ as getSlots, r as IF_TRUE_CONDITION_SLOT_NAME, s as IF_FALSE_CONDITION_SLOT_NAME, g as SKIP_BINDING_FOR_COMPONENTS, i as TAG_ATTRIBUTE, b as MODEL_KEY, j as TAG_MODEL_FUNCTION_PROPERTY, Z as isAttributePresentOnElement, V as VIEW_MODEL_KEY, D as DISABLE_BINDING, Y as bindElementChangeToModel, h as PSK_CARDINAL_PREFIX } from './index-8ae4b65b.js';

class ComponentsListenerService {
  constructor(host, { model, translationModel, tags, routing, chain }) {
    this.listeners = {
      getModel: () => null,
      getTranslationModel: () => null,
      getTags: () => null,
      getRouting: () => null,
      getParentChain: () => null
    };
    this.host = host;
    if (model) {
      this.listeners.getModel = (event) => {
        event.stopImmediatePropagation();
        const callback = extractCallback(event);
        if (!callback)
          return;
        if (event.detail.chain) {
          let chain = event.detail.chain;
          if (!chain.startsWith(MODEL_CHAIN_PREFIX)) {
            console.warn([
              `Invalid chain found for ${event} (chain: "${chain}")!`,
              `A valid chain must start with "${MODEL_CHAIN_PREFIX}".`,
            ].join('\n'));
            callback(undefined, model);
            return;
          }
          chain = chain.slice(1);
          callback(undefined, model.getChainValue(chain));
          return;
        }
        callback(undefined, model);
      };
    }
    if (translationModel) {
      this.listeners.getTranslationModel = (event) => {
        event.stopImmediatePropagation();
        const callback = extractCallback(event);
        if (!callback)
          return;
        if (event.detail.chain) {
          let chain = event.detail.chain;
          if (!chain.startsWith(TRANSLATION_CHAIN_PREFIX)) {
            console.warn([
              `Invalid chain found for ${event} (chain: "${chain}")!`,
              `A valid chain must start with "${TRANSLATION_CHAIN_PREFIX}".`,
            ].join('\n'));
            callback(undefined, translationModel);
            return;
          }
          chain = chain.slice(1);
          callback(undefined, translationModel.getChainValue(chain));
          return;
        }
        callback(undefined, translationModel);
      };
    }
    if (tags) {
      this.tags = tags;
      this.listeners.getTags = (event) => {
        event.stopImmediatePropagation();
        const callback = extractCallback(event);
        if (!callback)
          return;
        if (event.detail.tag) {
          if (!this.tags[event.detail.tag]) {
            return callback(`There is no page tag "${event.detail.tag}" registered in webcardinal.json`);
          }
          return callback(undefined, this.tags[event.detail.tag]);
        }
        return callback(undefined, this.tags);
      };
    }
    if (routing) {
      this.routing = routing;
      this.listeners.getRouting = (event) => {
        event.stopImmediatePropagation();
        const callback = extractCallback(event);
        if (!callback)
          return;
        callback(undefined, this.routing);
      };
    }
    if (typeof chain !== "undefined") {
      this.chain = chain;
      this.listeners.getParentChain = (event) => {
        event.stopImmediatePropagation();
        const callback = extractCallback(event);
        if (!callback)
          return;
        callback(undefined, this.chain);
      };
    }
  }
  get getModel() {
    const eventName = EVENT_MODEL_GET;
    return {
      add: () => this.host.addEventListener(eventName, this.listeners.getModel),
      remove: () => this.host.removeEventListener(eventName, this.listeners.getModel),
      eventName,
    };
  }
  get getTranslationModel() {
    const eventName = EVENT_TRANSLATION_MODEL_GET;
    return {
      add: () => this.host.addEventListener(eventName, this.listeners.getTranslationModel),
      remove: () => this.host.removeEventListener(eventName, this.listeners.getTranslationModel),
      eventName,
    };
  }
  get getParentChain() {
    const eventName = EVENT_PARENT_CHAIN_GET;
    return {
      add: () => this.host.addEventListener(eventName, this.listeners.getParentChain),
      remove: () => this.host.removeEventListener(eventName, this.listeners.getParentChain),
      eventName,
    };
  }
  get getTags() {
    if (!this.tags)
      return;
    const eventName = EVENT_TAGS_GET;
    return {
      add: () => this.host.addEventListener(eventName, this.listeners.getTags),
      remove: () => this.host.removeEventListener(eventName, this.listeners.getTags),
      eventName,
    };
  }
  get getRouting() {
    if (!this.routing)
      return;
    const eventName = EVENT_ROUTING_GET;
    return {
      add: () => this.host.addEventListener(eventName, this.listeners.getRouting),
      remove: () => this.host.removeEventListener(eventName, this.listeners.getRouting),
      eventName,
    };
  }
}

const { join } = URLHelper;
const ControllerRegistryService = {
  getController: async (controllerPath) => {
    const { controllers, basePath } = window.WebCardinal;
    const skin = getSkinFromState();
    if (controllers[controllerPath]) {
      return controllers[controllerPath];
    }
    // check if there is a controller for current skin
    let controller = await loadJS(join(basePath, getSkinPathFromState(), SCRIPTS_PATH, 'controllers', controllerPath).pathname);
    if (controller) {
      controllers[controllerPath] = controller;
      return controller;
    }
    // only one request for default skin
    if (skin === 'default') {
      return;
    }
    // if there is no controller from skin, fallback is to default skin (root level)
    controller = await loadJS(join(basePath, SCRIPTS_PATH, 'controllers', controllerPath).pathname);
    if (controller) {
      controllers[controllerPath] = controller;
      return controller;
    }
    return;
  },
};

const { join: join$1 } = URLHelper;
const ControllerTranslationService = {
  loadAndSetTranslationsForPage: async (routingContext) => {
    var _a;
    const { basePath, mapping } = routingContext;
    const skin = getSkinFromState();
    if (!window.WebCardinal.translations) {
      window.WebCardinal.translations = {};
    }
    const { translations } = window.WebCardinal;
    let { pathname } = window.location;
    if (pathname.endsWith('/') && pathname !== '/') {
      // trim pathname if ends with "/", except for the corner case when pathname === "/"
      pathname = pathname.slice(0, -1);
    }
    if ((_a = translations[skin]) === null || _a === void 0 ? void 0 : _a[pathname]) {
      // the translations are already set for the current skin and page
      return true;
    }
    const source = mapping[pathname];
    if (!source) {
      console.warn(`No HTML page mapping was found for the current pathname: ${pathname}`);
      return false;
    }
    if (source.startsWith('http')) {
      console.warn('Translations for external sources are not supported yet!');
      return false;
    }
    let pathWithoutExtension = source.slice(0, source.lastIndexOf('.'));
    let pathWithExtension = `${pathWithoutExtension}.translate`;
    // check if there is a translation for current skin
    let [error, translationFile] = await loadJSON(join$1(basePath, getSkinPathFromState(), pathWithExtension).pathname);
    if (!error) {
      if (!translations[skin]) {
        translations[skin] = {};
      }
      translations[skin][pathname] = translationFile;
      return true;
    }
    // only one request for default skin
    if (skin === 'default') {
      return false;
    }
    [error, translationFile] = await loadJSON(join$1(basePath, pathWithExtension).pathname);
    if (!error) {
      if (!translations['default']) {
        translations['default'] = {};
      }
      translations['default'][pathname] = translationFile;
      return true;
    }
    return false;
  },
};

const STYLED_TAG = 'data-styled';
const SHADOW_TAG = 'data-shadow';
const RULES_REG_EXP = /(.+?){([\w\W]*?)}/g;
const COMMENTS_REG_EXP = /\/\*[\w\W]*?\*\//g;
const MEDIA_QUERIES_REG_EXP = /@media(.+?){([\s\n]*((.+?){([\w\W]*?)})*?[\s\n]*)*[\s\n]*}/g;
const SELECT_SPLIT_REG_EXP = /[~>+ ]/;
class StylingService {
  constructor(host, target) {
    this.host = host;
    this.target = target;
  }
  async applyFromHref(href) {
    const styleText = await StylingService.fetchSource(href);
    await this.applyFromStyleText(styleText);
  }
  async applyFromStyleText(styleText) {
    styleText = StylingService.removeComments(styleText);
    // let mediaQueries = StylingService.getMediaQueries(styleText);
    styleText = StylingService.removeMediaQueries(styleText);
    let rules = StylingService.getRules(styleText);
    for (let [selector, properties] of Object.entries(rules)) {
      this.applyProperties(this.host, selector, properties);
    }
  }
  applyProperties(host, selector, properties) {
    const elements = host.querySelectorAll(selector);
    if (elements.length > 0) {
      if (!host.host) {
        console.warn(`You must use custom styling only when you want to customise a #shadow-root (document fragment)\n`, `In this case use a "link ref='stylesheet'" or a "style" element!\n`, `Read the docs regarding to "${SHADOW_TAG}" attribute!\n`, `target selector: "${selector}"\n`, `target element:`, this.target);
      }
      let hostStyles = [];
      for (let i = 0; i < elements.length; i++) {
        hostStyles.push(`${selector}{${properties}}`);
      }
      let styleElement = host.querySelector(`[${STYLED_TAG}]`);
      if (!styleElement) {
        styleElement = StylingService.appendStyle(host, '');
      }
      if (hostStyles.length > 0) {
        styleElement.append(hostStyles.join('\n'));
      }
      return;
    }
    let arrayOfSelectors = selector.split(SELECT_SPLIT_REG_EXP).filter(String);
    let shadowSelector = '';
    for (let part of arrayOfSelectors) {
      if (part.endsWith(`[${SHADOW_TAG}]`)) {
        shadowSelector = part;
        break;
      }
    }
    if (!shadowSelector) {
      return;
    }
    let [beforeSelector, afterSelector] = selector.split(shadowSelector);
    selector = beforeSelector + shadowSelector.replace(`[${SHADOW_TAG}]`, '');
    let shadowElements = host.querySelectorAll(selector);
    for (let element of shadowElements) {
      if (element.shadowRoot) {
        this.applyProperties(element.shadowRoot, `${afterSelector.trim()}`, properties);
      }
    }
  }
  static async fetchSource(sourcePath) {
    try {
      const response = await fetch(sourcePath);
      return response.ok ? await response.text() : '';
    }
    catch (error) {
      console.error(error);
      return '';
    }
  }
  static removeComments(styleText) {
    return styleText.replace(COMMENTS_REG_EXP, '').trim();
  }
  static removeMediaQueries(styleText) {
    return styleText.replace(MEDIA_QUERIES_REG_EXP, '').trim();
  }
  /**
   * @futureOff
   **/
  // private static getMediaQueries(styleText: string) {
  //   let regex = MEDIA_QUERIES_REG_EXP;
  //   let queries = [];
  //   for (let rule of Array.from((styleText as any).matchAll(regex))) {
  //     if (Array.isArray(rule) && rule.length < 2) {
  //       continue;
  //     }
  //     let query = rule[1].trim();
  //     let rules = StylingService.getRules(rule[2]);
  //     queries.push({ query, rules });
  //   }
  //   return queries;
  // }
  static getRules(styleText) {
    let regex = RULES_REG_EXP;
    let rules = {};
    for (let rule of Array.from(styleText.matchAll(regex))) {
      if (Array.isArray(rule) && rule.length < 2) {
        continue;
      }
      let selector = rule[1].trim();
      if (selector.startsWith('@')) {
        continue;
      }
      rules[selector] = rule[2].split(';').map(i => i.trim()).filter(String).join(';');
    }
    return rules;
  }
  static appendStyle(host, styleText) {
    const styleElement = document.createElement('style');
    styleElement.setAttribute(STYLED_TAG, '');
    styleElement.innerText = styleText;
    host.append(styleElement);
    return styleElement;
  }
}

function setElementModel(element, model, chain) {
  // model
  const targetModel = model.getChainValue(chain);
  if (targetModel) {
    for (const [key, value] of Object.entries(targetModel)) {
      setElementValue(element, { key, value });
    }
    if (targetModel._saveElement === true) {
      // ensure that each of element's methods have the correct context attached,
      // because the model proxy doesn't set the context accordingly
      for (const property in element) {
        if (typeof element[property] === 'function') {
          element[property] = element[property].bind(element);
        }
      }
      if (!targetModel.getElement) {
        // we first the getElement function only on the initialization step in order to not generate useless model change events
        // which can lead to infinite loops
        model.setChainValue(chain, Object.assign(Object.assign({}, targetModel), { getElement: () => element }));
      }
    }
  }
  // expressions
  if (model.hasExpression(chain)) {
    const targetModel = model.evaluateExpression(chain);
    for (const [key, value] of Object.entries(targetModel)) {
      setElementValue(element, { key, value });
    }
  }
}
function isElementNode(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}
function isTextNode(node) {
  return node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim();
}

function handleDataForAttributePresence(element, bindElement, { model, translationModel, chainPrefix, enableTranslations = false } = {
  model: null,
  translationModel: null,
}) {
  let dataForAttributeChain = element.getAttribute(FOR_ATTRIBUTE);
  if (!dataForAttributeChain.startsWith(MODEL_CHAIN_PREFIX)) {
    console.warn(`Attribute "${FOR_ATTRIBUTE}" doesn't start with the chain prefix!`);
    return;
  }
  dataForAttributeChain = dataForAttributeChain.slice(1);
  const completeChain = getCompleteChain(chainPrefix, dataForAttributeChain);
  let dataForAttributeModelValue = model.getChainValue(completeChain);
  if (!Array.isArray(dataForAttributeModelValue)) {
    console.error(`Attribute "${FOR_ATTRIBUTE}" (${dataForAttributeChain}) must be a chain to an array in the model!`, element);
    return;
  }
  let dataForAttributeModelValueLength = dataForAttributeModelValue.length;
  const forOptions = (element.getAttribute(FOR_OPTIONS) || '').split(' ').filter(String);
  const areEventsActivated = forOptions.includes(FOR_EVENTS);
  const isOptimisticMode = forOptions.includes(FOR_OPTIMISTIC);
  let isWrapperRerenderMode = forOptions.includes(FOR_WRAPPER_RERENDER);
  const noDataTemplates = [];
  const templates = [];
  //Event delegation:Custom handling on the parent instead of using ComponentsListenerService for each child
  listenForPrefixChainEvents(element, completeChain);
  while (element.childNodes.length > 0) {
    const firstChild = element.childNodes[0];
    if (isElementNode(firstChild) && firstChild.getAttribute('slot') === FOR_NO_DATA_SLOT_NAME) {
      noDataTemplates.push(firstChild);
    }
    else {
      templates.push(firstChild);
    }
    removeChangeHandler(firstChild, model);
    firstChild.remove();
  }
  let existingNodes = [];
  const renderTemplate = () => {
    if (!dataForAttributeModelValueLength) {
      removeElementChildNodes(element, model);
      noDataTemplates.forEach(templateNode => {
        const childElement = templateNode.cloneNode(true);
        // when nesting multiple data-for attributes, the inner slots will have the hidden property set automatically
        removeSlotInfoFromElement(childElement);
        element.appendChild(childElement);
        bindElement(childElement, {
          model,
          translationModel,
          chainPrefix: chainPrefix,
          enableTranslations,
          recursive: true,
        });
      });
      return;
    }
    if (isWrapperRerenderMode) {
      const wrapper = document.createElement(element.tagName);
      const attributes = Array.prototype.slice.call(element.attributes);
      let attribute;
      while ((attribute = attributes.pop())) {
        if (attribute.nodeName === FOR_OPTIONS)
          continue;
        wrapper.setAttribute(attribute.nodeName, attribute.nodeValue);
      }
      if (forOptions.length > 0) {
        wrapper.setAttribute(FOR_OPTIONS, forOptions.join(' '));
      }
      element.insertAdjacentElement('afterend', wrapper);
      element.remove();
      element = wrapper;
    }
    dataForAttributeModelValue.forEach((_modelElement, modelElementIndex) => {
      const updatedNodes = [];
      templates.forEach(templateNode => {
        const childElement = templateNode.cloneNode(true);
        const modelElementChainPrefix = getCompleteChain(completeChain, modelElementIndex);
        bindElement(childElement, {
          model,
          translationModel,
          chainPrefix: modelElementChainPrefix,
          enableTranslations,
          recursive: true,
        });
        updatedNodes.push(childElement);
      });
      if (existingNodes[modelElementIndex]) {
        // we have existing nodes that we need to update
        updatedNodes.forEach((element, index) => {
          const existingElement = document.createElement('div');
          existingElement.appendChild(existingNodes[modelElementIndex][index].cloneNode(true));
          const templateMap = createDomMap(element);
          const domMap = createDomMap(existingNodes[modelElementIndex][index]);
          diffDomMap(templateMap, domMap, existingNodes[modelElementIndex][index]);
        });
      }
      else {
        updatedNodes.forEach(childElement => {
          element.appendChild(childElement);
        });
        existingNodes[modelElementIndex] = updatedNodes;
      }
    });
    // remove any leftover existingNodes
    for (let index = dataForAttributeModelValueLength; index < existingNodes.length; index++) {
      const nodes = existingNodes[index];
      nodes.forEach(node => {
        removeElementChildNodes(node, model);
        node.remove();
      });
    }
    existingNodes.splice(dataForAttributeModelValueLength);
  };
  const updateAndRenderTemplate = (newValue, forceRefresh = false) => {
    if (!Array.isArray(newValue)) {
      console.error(`Attribute "${FOR_ATTRIBUTE}" must be an array in the model!`);
      newValue = [];
    }
    newValue = newValue || [];
    const hasContentLengthChanged = dataForAttributeModelValueLength !== newValue.length;
    dataForAttributeModelValue = newValue;
    dataForAttributeModelValueLength = dataForAttributeModelValue.length;
    if (isOptimisticMode) {
      // in optimistic mode there is no need to cleanup the existing content,
      // since there is an optimized comparison process that is being executed instead
      renderTemplate();
      if (areEventsActivated) {
        element.dispatchEvent(new CustomEvent(FOR_CONTENT_UPDATED_EVENT));
      }
      return;
    }
    if (forceRefresh || hasContentLengthChanged) {
      // if we have a force refresh or the length of the list has changed,
      // then we will cleanup the existing content and recreated it from scratch
      // to make sure there are no leftover content/binding that could generate issues
      removeElementChildNodes(element, model);
      existingNodes = [];
      renderTemplate();
      if (areEventsActivated) {
        element.dispatchEvent(new CustomEvent(FOR_CONTENT_REPLACED_EVENT));
      }
    }
  };
  renderTemplate();
  // initial binding
  //   bindElementChangeToModel(element, model, completeChain);
  bindElementAttributes(element, model, MODEL_CHAIN_PREFIX, chainPrefix);
  if (enableTranslations) {
    bindElementAttributes(element, translationModel, TRANSLATION_CHAIN_PREFIX, chainPrefix);
  }
  const modelChangeHandler = ({ targetChain }) => {
    // if completeChain === targetChain then it means the array has been changed by an array method (e.g. splice)
    const forceRefresh = completeChain === targetChain;
    updateAndRenderTemplate(model.getChainValue(completeChain), forceRefresh);
  };
  model.onChange(completeChain, modelChangeHandler);
  setElementChainChangeHandler(element, completeChain, modelChangeHandler);
  if (model.hasExpression(completeChain)) {
    const expressionChangeHandler = () => {
      updateAndRenderTemplate(model.evaluateExpression(completeChain));
    };
    model.onChangeExpressionChain(completeChain, expressionChangeHandler);
    setElementExpressionChangeHandler(element, completeChain, expressionChangeHandler);
  }
}

function handleDataIfAttributePresence(element, bindElement, { model, translationModel, chainPrefix, enableTranslations = false } = {
  model: null,
  translationModel: null,
}) {
  let conditionChain = element.getAttribute(IF_ATTRIBUTE);
  if (!conditionChain.startsWith(MODEL_CHAIN_PREFIX)) {
    console.warn(`Attribute "${IF_ATTRIBUTE}" doesn't start with the chain prefix!`);
    return;
  }
  conditionChain = conditionChain.slice(1);
  const completeConditionChain = getCompleteChain(chainPrefix, conditionChain);
  const children = Array.from(element.children);
  let conditionValue;
  let trueSlotElements = getSlots(children, IF_TRUE_CONDITION_SLOT_NAME);
  const falseSlotElements = getSlots(children, IF_FALSE_CONDITION_SLOT_NAME);
  if (!trueSlotElements.length && !falseSlotElements.length) {
    trueSlotElements = Array.from(element.childNodes);
  }
  removeElementChildNodes(element, model);
  const setVisibleContent = () => {
    const visibleSlots = conditionValue ? trueSlotElements : falseSlotElements;
    removeElementChildNodes(element, model);
    visibleSlots.forEach(slot => {
      const slotElement = slot.cloneNode(true);
      removeSlotInfoFromElement(slotElement);
      element.appendChild(slotElement);
      bindElement(slotElement, {
        model,
        translationModel,
        chainPrefix,
        enableTranslations,
        recursive: true,
      });
    });
  };
  const setExtractedConditionValue = async (extractedConditionValue) => {
    let value;
    if (extractedConditionValue instanceof Promise) {
      try {
        value = await extractedConditionValue;
      }
      catch (error) {
        console.error('data-if condition promise failed', error);
        value = false;
      }
    }
    else {
      value = !!extractedConditionValue; // ensure we have a boolean value
    }
    // the value has changed so the visible content must be updated
    const mustUpdateVisibleContent = conditionValue !== value;
    conditionValue = value;
    if (mustUpdateVisibleContent) {
      setVisibleContent();
    }
  };
  setExtractedConditionValue(model.getChainValue(completeConditionChain));
  // initial binding
  //   bindElementChangeToModel(element, model, completeConditionChain);
  bindElementAttributes(element, model, MODEL_CHAIN_PREFIX, chainPrefix);
  if (enableTranslations) {
    bindElementAttributes(element, translationModel, TRANSLATION_CHAIN_PREFIX, chainPrefix);
  }
  if (model.hasExpression(completeConditionChain)) {
    setExtractedConditionValue(model.evaluateExpression(completeConditionChain));
    const expressionChangeHandler = () => {
      setExtractedConditionValue(model.evaluateExpression(completeConditionChain));
    };
    model.onChangeExpressionChain(completeConditionChain, expressionChangeHandler);
    setElementExpressionChangeHandler(element, completeConditionChain, expressionChangeHandler);
  }
  else {
    const chainChangeHandler = () => {
      setExtractedConditionValue(model.getChainValue(completeConditionChain));
    };
    model.onChange(completeConditionChain, chainChangeHandler);
    setElementChainChangeHandler(element, completeConditionChain, chainChangeHandler);
  }
}

function bindNodeValue(node, model, translationModel, modelChainPrefix = null) {
  // for some webc-<components> binding is managed by component itself
  if (SKIP_BINDING_FOR_COMPONENTS.includes(node.nodeName.toLowerCase())) {
    return;
  }
  if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue || !node.nodeValue.trim()) {
    // the current node is either not a text node or has an empty value
    return;
  }
  const bindingExpressionTexts = [...node.nodeValue.matchAll(/\{\{\s*([^\s}}]+)\s*\}\}/g)];
  if (!bindingExpressionTexts.length) {
    // no binding expressions were found
    return;
  }
  const bindingExpressions = bindingExpressionTexts
    .map(x => {
    return {
      expression: x[0],
      chainWithPrefix: x[1],
    };
  })
    .filter(({ chainWithPrefix }) => {
    return chainWithPrefix.startsWith(MODEL_CHAIN_PREFIX) || chainWithPrefix.startsWith(TRANSLATION_CHAIN_PREFIX);
  })
    .map(expression => {
    let { chainWithPrefix } = expression;
    const isTranslation = chainWithPrefix.startsWith(TRANSLATION_CHAIN_PREFIX);
    let chain = expression.chainWithPrefix.slice(1);
    if (!isTranslation && modelChainPrefix) {
      // prepend the modelChainPrefix
      chain = getCompleteChain(modelChainPrefix, chain);
      chainWithPrefix = `${MODEL_CHAIN_PREFIX}${chain}`;
    }
    const currentModel = isTranslation ? translationModel : model;
    return Object.assign(Object.assign({}, expression), { chain,
      isTranslation, isModel: !isTranslation, isModelExpression: currentModel.hasExpression(chain), evaluateModelExpression: () => currentModel.evaluateExpression(chain), model: currentModel, getChainValue: () => {
        let value = currentModel.getChainValue(chain);
        if (isTranslation && value === undefined) {
          const { pathname } = window.location;
          const skin = getSkinFromState();
          console.warn(`No translations found for skin "${skin}", page "${pathname}" and chain "${chain}"`);
          // we have a translation for a missing key, so we return the translation key (chain)
          value = chain;
        }
        return value;
      } });
  });
  if (!bindingExpressions.length) {
    // no supported binding found
    return;
  }
  const originalNodeValue = node.nodeValue;
  const updateNodeValue = () => {
    let updatedNodeValue = originalNodeValue;
    bindingExpressions.forEach(({ expression, getChainValue, isModelExpression, evaluateModelExpression }) => {
      let value = getChainValue();
      if (['number', 'boolean'].includes(typeof value)) {
        value = value.toString();
      }
      if (!value && isModelExpression) {
        value = isModelExpression ? evaluateModelExpression() : '';
      }
      updatedNodeValue = updatedNodeValue.replace(expression, value || '');
    });
    node.nodeValue = updatedNodeValue;
  };
  updateNodeValue();
  bindingExpressions
    .filter(x => x.isModel)
    .forEach(({ model, chain, isModelExpression }) => {
    const chainChangeHandler = () => {
      updateNodeValue();
    };
    model.onChange(chain, chainChangeHandler);
    setElementChainChangeHandler(node, chain, chainChangeHandler);
    if (isModelExpression) {
      const expressionChangeHandler = () => {
        updateNodeValue();
      };
      model.onChangeExpressionChain(chain, expressionChangeHandler);
      setElementExpressionChangeHandler(node, chain, expressionChangeHandler);
    }
  });
}

const BindingService = {
  bindElement: (elementOrChildNode, options = {
    model: null,
    translationModel: null,
  }) => {
    const { model, translationModel, chainPrefix, enableTranslations = false, recursive = false } = options;
    if (!model) {
      const tagName = isElementNode(elementOrChildNode)
        ? elementOrChildNode.tagName.toLowerCase()
        : 'text node';
      console.warn(`No model found for: ${tagName}!`);
      return;
    }
    if (isTextNode(elementOrChildNode)) {
      bindNodeValue(elementOrChildNode, model, translationModel, chainPrefix);
      return;
    }
    if (isElementNode(elementOrChildNode)) {
      const element = elementOrChildNode;
      // for WebCardinal <components> made with define and webc-component
      if (window.WebCardinal.components.tags.has(element.tagName.toLowerCase())) {
        return;
      }
      // for some webc-<components> binding of innerHTML of component is managed by component itself
      // but attributes binding is allowed
      if (SKIP_BINDING_FOR_COMPONENTS.includes(element.tagName.toLowerCase())) {
        return bindElementAttributes(element, model, MODEL_CHAIN_PREFIX, chainPrefix);
      }
      if (element.hasAttribute(TAG_ATTRIBUTE)) {
        let currentChain;
        if (element.hasAttribute(MODEL_KEY)) {
          // take the current chain from the MODEL_KEY
          currentChain = element.getAttribute(MODEL_KEY);
          if (currentChain === null || currentChain === void 0 ? void 0 : currentChain.startsWith(MODEL_CHAIN_PREFIX)) {
            currentChain = currentChain.slice(1);
          }
        }
        const completeChain = getCompleteChain(chainPrefix, currentChain);
        element[TAG_MODEL_FUNCTION_PROPERTY] = () => {
          if (model.hasExpression(completeChain)) {
            return model.evaluateExpression(completeChain);
          }
          return model.toObject(completeChain);
        };
        // element[TAG_MODEL_PROPERTY] = model.toObject(completeChain);
        // model.onChange(completeChain, _ => {
        //   element[TAG_MODEL_PROPERTY] = model.toObject(completeChain);
        // });
        // if (model.hasExpression(completeChain)) {
        //   element[TAG_MODEL_PROPERTY] = model.evaluateExpression(completeChain);
        //   model.onChangeExpressionChain(completeChain, _ => {
        //     element[TAG_MODEL_PROPERTY] = model.evaluateExpression(completeChain);
        //   });
        // }
      }
      const hasDataIfAttribute = isAttributePresentOnElement(element, IF_ATTRIBUTE);
      const hasDataForAttribute = isAttributePresentOnElement(element, FOR_ATTRIBUTE);
      if (hasDataIfAttribute && hasDataForAttribute) {
        console.error('Cannot use both data-if and data-for attributes on the same element', element);
      }
      else if (hasDataIfAttribute) {
        handleDataIfAttributePresence(element, BindingService.bindElement, options);
      }
      else if (hasDataForAttribute) {
        handleDataForAttributePresence(element, BindingService.bindElement, options);
      }
      else {
        const hasViewModelAttribute = element.hasAttribute(VIEW_MODEL_KEY);
        const hasModelAttribute = element.hasAttribute(MODEL_KEY);
        const hasDisableBinding = element.hasAttribute(DISABLE_BINDING);
        if (!hasDisableBinding) {
          if (hasViewModelAttribute || hasModelAttribute) {
            let chain;
            if (hasViewModelAttribute) {
              chain = element.getAttribute(VIEW_MODEL_KEY);
            }
            else {
              console.warn(`Attribute "${MODEL_KEY}" is deprecated for binding! Use the "${VIEW_MODEL_KEY}" key attribute instead.`, element);
              chain = element.getAttribute(MODEL_KEY);
            }
            if (chain.startsWith(MODEL_CHAIN_PREFIX)) {
              chain = chain.slice(1);
              const completeChain = getCompleteChain(chainPrefix, chain);
              // update VIEW_MODEL_KEY
              element.setAttribute(VIEW_MODEL_KEY, `${MODEL_CHAIN_PREFIX}${completeChain}`);
              if (hasModelAttribute) {
                // temporary update deprecated MODEL_KEY attribute
                element.setAttribute(MODEL_KEY, `${MODEL_CHAIN_PREFIX}${completeChain}`);
              }
              // initial binding
              setElementModel(element, model, completeChain);
              bindElementChangeToModel(element, model, completeChain);
              // onChange
              const changeHandler = () => setElementModel(element, model, completeChain);
              model.onChange(completeChain, changeHandler);
              setElementChainChangeHandler(element, chain, changeHandler);
              // onChangeExpressionChain
              if (model.hasExpression(completeChain)) {
                const changeExpressionChainHandler = () => setElementModel(element, model, completeChain);
                model.onChangeExpressionChain(completeChain, changeExpressionChainHandler);
                setElementExpressionChangeHandler(element, completeChain, changeExpressionChainHandler);
              }
            }
            else {
              console.warn(`Invalid chain found! (chain: "${chain}")!\n`, `A valid chain must start with "${MODEL_CHAIN_PREFIX}".\n`, `target element:`, element);
            }
          }
          // for psk-<components> @BindModel decorator is design for this task
          if (!element.tagName.startsWith(PSK_CARDINAL_PREFIX.toUpperCase())) {
            bindElementAttributes(element, model, MODEL_CHAIN_PREFIX, chainPrefix);
          }
          if (enableTranslations) {
            bindElementAttributes(element, translationModel, TRANSLATION_CHAIN_PREFIX, chainPrefix);
          }
          Array.from(element.childNodes)
            .filter(isTextNode)
            .forEach(node => {
            bindNodeValue(node, model, translationModel, chainPrefix);
          });
        }
        if (recursive) {
          Array.from(element.children).forEach(child => {
            BindingService.bindElement(child, options);
          });
        }
      }
    }
  },
  bindChildNodes: (element, options) => {
    Array.from(element.childNodes).forEach(child => {
      BindingService.bindElement(child, Object.assign({}, options));
    });
  },
};

export { BindingService as B, ComponentsListenerService as C, StylingService as S, ControllerRegistryService as a, ControllerTranslationService as b, isElementNode as c, isTextNode as i };
