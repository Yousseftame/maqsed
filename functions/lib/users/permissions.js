"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_AVAILABLE_ACTIONS = exports.PERMISSION_ACTIONS = exports.PERMISSION_MODULES = void 0;
exports.emptyPermissions = emptyPermissions;
exports.sanitizePermissions = sanitizePermissions;
exports.PERMISSION_MODULES = ["cities", "projects", "units", "offers", "customers"];
exports.PERMISSION_ACTIONS = ["create", "read", "edit", "delete"];
exports.MODULE_AVAILABLE_ACTIONS = {
    cities: ["create", "read", "delete"],
    projects: ["create", "read", "edit", "delete"],
    units: ["create", "read", "edit", "delete"],
    offers: ["create", "read", "edit"],
    customers: ["read", "edit", "delete"],
};
function emptyModulePermission() {
    return { create: false, read: false, edit: false, delete: false };
}
function emptyPermissions() {
    return {
        cities: emptyModulePermission(),
        projects: emptyModulePermission(),
        units: emptyModulePermission(),
        offers: emptyModulePermission(),
        customers: emptyModulePermission(),
    };
}
function sanitizePermissions(input) {
    const source = input && typeof input === "object" ? input : {};
    const next = emptyPermissions();
    for (const module of exports.PERMISSION_MODULES) {
        const current = source[module];
        for (const action of exports.MODULE_AVAILABLE_ACTIONS[module]) {
            next[module][action] = Boolean(current?.[action]);
        }
        if ((next[module].create || next[module].edit || next[module].delete) &&
            exports.MODULE_AVAILABLE_ACTIONS[module].includes("read")) {
            next[module].read = true;
        }
    }
    return next;
}
//# sourceMappingURL=permissions.js.map