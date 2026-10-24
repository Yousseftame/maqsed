"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_AVAILABLE_ACTIONS = exports.PERMISSION_ACTIONS = exports.PERMISSION_MODULES = void 0;
exports.sanitizePermissions = sanitizePermissions;
exports.PERMISSION_MODULES = [
    "users",
    "cities",
    "projects",
    "units",
    "offers",
    "customers",
    "blog",
    "faq",
    "additionalInfo",
    "menus",
    "partners",
    "interface",
    "about",
    "company",
    "maintenance",
    "payments",
];
exports.PERMISSION_ACTIONS = ["create", "read", "edit", "delete", "sort"];
exports.MODULE_AVAILABLE_ACTIONS = {
    users: ["create", "read", "edit", "delete"],
    cities: ["create", "read", "delete"],
    projects: ["create", "read", "edit", "delete"],
    units: ["create", "read", "edit", "delete"],
    offers: ["create", "read", "edit", "delete"],
    customers: ["read", "edit", "delete"],
    blog: ["create", "read", "edit", "delete", "sort"],
    faq: ["create", "read", "edit", "delete"],
    additionalInfo: ["create", "read", "edit", "delete", "sort"],
    menus: ["create", "read", "delete"],
    partners: ["create", "read", "edit", "delete", "sort"],
    interface: ["read", "edit"],
    about: ["read", "edit"],
    company: ["read", "edit"],
    maintenance: ["read", "edit"],
    payments: ["read"],
};
function emptyModulePermission() {
    return { create: false, read: false, edit: false, delete: false, sort: false };
}
function emptyPermissions() {
    return {
        users: emptyModulePermission(),
        cities: emptyModulePermission(),
        projects: emptyModulePermission(),
        units: emptyModulePermission(),
        offers: emptyModulePermission(),
        customers: emptyModulePermission(),
        blog: emptyModulePermission(),
        faq: emptyModulePermission(),
        additionalInfo: emptyModulePermission(),
        menus: emptyModulePermission(),
        partners: emptyModulePermission(),
        interface: emptyModulePermission(),
        about: emptyModulePermission(),
        company: emptyModulePermission(),
        maintenance: emptyModulePermission(),
        payments: emptyModulePermission(),
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
        const hasWrite =
            next[module].create || next[module].edit || next[module].delete || next[module].sort;
        if (hasWrite && exports.MODULE_AVAILABLE_ACTIONS[module].includes("read")) {
            next[module].read = true;
        }
    }
    return next;
}
//# sourceMappingURL=permissions.js.map
