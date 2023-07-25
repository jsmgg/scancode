function defineTemplateBodyVisitor(context, templateBodyVisitor, scriptVisitor) {
  if (context.parserServices.defineTemplateBodyVisitor == null) {
    console.warn(
      'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.',
    )
    return {}
  }

  return context.parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor)
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: '',
    },
    fixable: null,
    schema: [],
    messages: {
      complex: 'complex add 1',
    },
  },
  create: function (context) {
    const addComplex = function (node) {
      context.report({
        node,
        loc: node.loc,
        messageId: 'complex',
      })
    }

    return defineTemplateBodyVisitor(context, {
      VIdentifier(node) {
        if (['if', 'for'].includes(node.name)) {
          addComplex(node)
        }
      },

      VElement(node) {
        if (node.name === 'template') {
          addComplex(node)
        }
      },

      LogicalExpression(node) {
        addComplex(node)
      },
    })
  },
}
