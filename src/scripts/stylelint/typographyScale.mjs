import stylelint from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint;

const ruleName = "motif/typography-scale";
const messages = ruleMessages(ruleName, {
  rejected: role =>
    `A role with a size step ("${role}") belongs to a size table: use the text scale, typography("text-#{$step}", $weight) (design-tokens.md §4)`,
});

// A role whose step comes from a variable (label-#{$size}) means the text grows with the component's size, which is what
// the text scale is for; a fixed role (label-md) is fine
const ROLE_WITH_STEP = /^\s*typography\(\s*["']((?:label|body|heading|display)-#\{[^}]+\})["']/;

const rule = primary => (root, result) => {
  if (!primary) return;
  root.walkAtRules("include", atRule => {
    const match = atRule.params.match(ROLE_WITH_STEP);
    match && report({ ruleName, result, node: atRule, message: messages.rejected(match[1]) });
  });
};

rule.ruleName = ruleName;
rule.messages = messages;

export default createPlugin(ruleName, rule);
