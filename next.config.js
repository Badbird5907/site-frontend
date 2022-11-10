import * as removeImports from "next-remove-imports";

export default (phase, { defaultConfig }) => {
    return removeImports.default({
        ...defaultConfig
    });
};
