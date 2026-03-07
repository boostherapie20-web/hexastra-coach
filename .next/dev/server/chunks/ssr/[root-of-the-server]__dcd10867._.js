module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/supabase/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        // Pendant le build Vercel les env vars peuvent être absentes.
        // On retourne un client factice qui ne plantera pas au prerender.
        // Les vraies pages sont 'use client' ou force-dynamic, donc ce cas
        // ne se produit qu'au build statique.
        return {
            auth: {
                getUser: async ()=>({
                        data: {
                            user: null
                        },
                        error: null
                    }),
                signInWithPassword: async ()=>({
                        error: {
                            message: 'Non configuré'
                        }
                    }),
                signUp: async ()=>({
                        error: {
                            message: 'Non configuré'
                        }
                    }),
                signOut: async ()=>{}
            },
            from: ()=>({
                    select: ()=>({
                            order: ()=>Promise.resolve({
                                    data: [],
                                    error: null
                                })
                        }),
                    insert: ()=>({
                            select: ()=>({
                                    single: ()=>Promise.resolve({
                                            data: null,
                                            error: null
                                        })
                                })
                        }),
                    update: ()=>({
                            eq: ()=>Promise.resolve({
                                    data: null,
                                    error: null
                                })
                        })
                })
        };
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(url, key);
}
}),
"[project]/app/chat/_components/ChatShell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function ChatShell({ left, right, header, body, composer, showLeft, showRight, onCloseLeft, onCloseRight, desktopLeft, desktopRight }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(180deg,#fbfdfb 0%,#f7faf6 48%,#f1f6f1 100%)'
        },
        children: [
            !desktopLeft && showLeft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Drawer, {
                side: "left",
                onClose: onCloseLeft,
                children: left
            }, void 0, false, {
                fileName: "[project]/app/chat/_components/ChatShell.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this),
            !desktopRight && showRight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Drawer, {
                side: "right",
                onClose: onCloseRight,
                children: right
            }, void 0, false, {
                fileName: "[project]/app/chat/_components/ChatShell.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'relative',
                    zIndex: 1,
                    display: 'grid',
                    gridTemplateColumns: `${desktopLeft ? '290px ' : ''}minmax(0,1fr)${desktopRight ? ' 320px' : ''}`,
                    minHeight: '100vh',
                    gap: 0
                },
                children: [
                    desktopLeft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        style: {
                            padding: '18px 0 18px 18px'
                        },
                        children: left
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/ChatShell.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        style: {
                            minWidth: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100vh'
                        },
                        children: [
                            header,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: 'auto',
                                    padding: '24px 28px 18px'
                                },
                                children: body
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/ChatShell.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'sticky',
                                    bottom: 0,
                                    zIndex: 19,
                                    padding: '10px 28px 20px',
                                    background: 'linear-gradient(180deg, rgba(247,250,246,0), rgba(247,250,246,0.88) 18%, rgba(247,250,246,0.98) 100%)',
                                    backdropFilter: 'blur(14px)',
                                    WebkitBackdropFilter: 'blur(14px)'
                                },
                                children: composer
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/ChatShell.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/chat/_components/ChatShell.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    desktopRight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        style: {
                            padding: '18px 18px 18px 0'
                        },
                        children: right
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/ChatShell.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/chat/_components/ChatShell.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/chat/_components/ChatShell.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
function Drawer({ children, side, onClose }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'rgba(18, 30, 23, 0.18)',
            backdropFilter: 'blur(10px)'
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: side === 'left' ? 290 : 320,
                maxWidth: '92vw',
                marginLeft: side === 'right' ? 'auto' : 0,
                padding: 18
            },
            onClick: (event)=>event.stopPropagation(),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    minHeight: 'calc(100vh - 36px)'
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/app/chat/_components/ChatShell.tsx",
                lineNumber: 134,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/chat/_components/ChatShell.tsx",
            lineNumber: 125,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/chat/_components/ChatShell.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/chat/_lib/chat.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DS",
    ()=>DS,
    "QUICK_PROMPTS",
    ()=>QUICK_PROMPTS,
    "STORAGE_KEYS",
    ()=>STORAGE_KEYS,
    "cardStyle",
    ()=>cardStyle,
    "makeReadingTitle",
    ()=>makeReadingTitle
]);
const STORAGE_KEYS = {
    readings: 'hexastra.readings.v2',
    projects: 'hexastra.projects.v2'
};
const QUICK_PROMPTS = [
    'Je veux une lecture claire de ma situation actuelle.',
    'Quel est le bon timing pour agir maintenant ?',
    'Aide-moi à comprendre ce qui se rejoue dans cette relation.',
    'Quelle direction devient plus naturelle pour moi ?'
];
const DS = {
    bg0: '#f7faf6',
    bg1: '#ffffff',
    bg2: '#f1f6f1',
    panel: 'rgba(255,255,255,0.82)',
    panelStrong: '#ffffff',
    glass: 'rgba(255,255,255,0.72)',
    line: 'rgba(20, 33, 26, 0.08)',
    lineStrong: 'rgba(20, 33, 26, 0.12)',
    text: '#14211A',
    textSoft: '#526157',
    textMuted: 'rgba(82, 97, 87, 0.82)',
    textFaint: 'rgba(20, 33, 26, 0.46)',
    textMute: 'rgba(20, 33, 26, 0.54)',
    emerald: '#19C37D',
    emeraldDeep: '#0E8F5B',
    emeraldSoft: 'rgba(25, 195, 125, 0.10)',
    emeraldGlow: 'rgba(25, 195, 125, 0.16)',
    gold: '#19C37D',
    amber: '#19C37D',
    gradient: 'linear-gradient(135deg, #19C37D 0%, #0E8F5B 100%)',
    surfaceGradient: 'linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.76))',
    bodyFont: "'Inter', system-ui, sans-serif",
    titleFont: "'Sora', system-ui, sans-serif",
    monoFont: "'SF Mono', 'Fira Code', ui-monospace, monospace",
    shadowSoft: '0 8px 24px rgba(16, 24, 20, 0.05)',
    shadowCard: '0 18px 48px rgba(16, 24, 20, 0.08)',
    shadowLarge: '0 24px 80px rgba(16, 24, 20, 0.10)'
};
function cardStyle(overrides) {
    return {
        background: DS.surfaceGradient,
        border: `1px solid ${DS.line}`,
        borderRadius: 28,
        boxShadow: DS.shadowCard,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        ...overrides
    };
}
function makeReadingTitle(input) {
    const clean = input.replace(/\s+/g, ' ').trim();
    if (!clean) return 'Lecture HexAstra';
    return clean.length > 48 ? `${clean.slice(0, 48).trim()}…` : clean;
}
}),
"[project]/app/chat/_components/ChatHeader.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_lib/chat.ts [app-ssr] (ecmascript)");
'use client';
;
;
const MODES = [
    {
        key: 'essentiel',
        label: 'Essentiel'
    },
    {
        key: 'premium',
        label: 'Premium'
    },
    {
        key: 'praticien',
        label: 'Praticien'
    }
];
function ChatHeader({ mode, onModeChange, onOpenLeft, onOpenRight, desktopLeft, desktopRight }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        style: {
            position: 'sticky',
            top: 0,
            zIndex: 18,
            padding: '16px 28px 12px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'linear-gradient(180deg, rgba(247,250,246,0.92), rgba(247,250,246,0.76))',
            borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: 1280,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                    },
                    children: [
                        !desktopLeft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onOpenLeft,
                            style: ghostButtonStyle,
                            children: "Menu"
                        }, void 0, false, {
                            fileName: "[project]/app/chat/_components/ChatHeader.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 10,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.18em',
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
                                        fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].monoFont
                                    },
                                    children: "HexAstra Coach"
                                }, void 0, false, {
                                    fileName: "[project]/app/chat/_components/ChatHeader.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
                                        fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].titleFont,
                                        fontSize: 20,
                                        fontWeight: 600,
                                        letterSpacing: '-0.03em',
                                        marginTop: 4
                                    },
                                    children: "Chat de clarté"
                                }, void 0, false, {
                                    fileName: "[project]/app/chat/_components/ChatHeader.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/chat/_components/ChatHeader.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/chat/_components/ChatHeader.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'inline-flex',
                        gap: 6,
                        padding: 6,
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.72)',
                        border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
                        boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].shadowSoft
                    },
                    children: MODES.map((item)=>{
                        const active = item.key === mode;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onModeChange(item.key),
                            style: {
                                padding: '10px 14px',
                                borderRadius: 999,
                                border: 'none',
                                background: active ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].gradient : 'transparent',
                                color: active ? '#ffffff' : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textSoft,
                                fontWeight: active ? 700 : 600,
                                fontSize: 13,
                                boxShadow: active ? '0 8px 22px rgba(25,195,125,0.22)' : 'none'
                            },
                            children: item.label
                        }, item.key, false, {
                            fileName: "[project]/app/chat/_components/ChatHeader.tsx",
                            lineNumber: 100,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/chat/_components/ChatHeader.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this),
                !desktopRight && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onOpenRight,
                    style: ghostButtonStyle,
                    children: "Outils"
                }, void 0, false, {
                    fileName: "[project]/app/chat/_components/ChatHeader.tsx",
                    lineNumber: 121,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/chat/_components/ChatHeader.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/chat/_components/ChatHeader.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
const ghostButtonStyle = {
    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
    background: 'rgba(255,255,255,0.72)',
    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
    borderRadius: 999,
    padding: '10px 14px',
    fontWeight: 600,
    boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].shadowSoft
};
}),
"[project]/app/chat/_components/Composer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Composer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_lib/chat.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function Composer({ value, onChange, onSend, onQuickPrompt, showQuickPrompts }) {
    const [focused, setFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!textareaRef.current) return;
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }, [
        value
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            maxWidth: 980,
            margin: '0 auto'
        },
        children: [
            showQuickPrompts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginBottom: 12
                },
                children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QUICK_PROMPTS"].map((prompt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onQuickPrompt(prompt),
                        className: "hx-chip",
                        children: prompt
                    }, prompt, false, {
                        fileName: "[project]/app/chat/_components/Composer.tsx",
                        lineNumber: 29,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/chat/_components/Composer.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 12,
                    borderRadius: 28,
                    padding: '14px 16px',
                    background: '#ffffff',
                    border: `1px solid ${focused ? 'rgba(25,195,125,0.34)' : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].lineStrong}`,
                    boxShadow: focused ? '0 0 0 4px rgba(25,195,125,0.08), 0 18px 40px rgba(16,24,20,0.08)' : '0 10px 30px rgba(16,24,20,0.08)',
                    transition: 'border-color 0.24s ease, box-shadow 0.24s ease'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconGhost, {
                        title: "Ajouter des données plus tard",
                        children: "◎"
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/Composer.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconGhost, {
                        title: "Assistant",
                        children: "◈"
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/Composer.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        ref: textareaRef,
                        rows: 1,
                        value: value,
                        onChange: (event)=>onChange(event.target.value),
                        onFocus: ()=>setFocused(true),
                        onBlur: ()=>setFocused(false),
                        onKeyDown: (event)=>{
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                onSend();
                            }
                        },
                        placeholder: "Décris ta situation, ton dilemme ou la zone que tu veux éclaircir…",
                        style: {
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            resize: 'none',
                            minHeight: 28,
                            maxHeight: 120,
                            overflowY: 'auto',
                            padding: '8px 2px 6px',
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
                            fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].bodyFont,
                            fontSize: 16,
                            lineHeight: 1.8,
                            letterSpacing: '0.01em'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/Composer.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onSend,
                        disabled: !value.trim(),
                        style: {
                            minWidth: 58,
                            padding: '11px 16px',
                            borderRadius: 16,
                            border: 'none',
                            background: value.trim() ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].gradient : '#E7EFE9',
                            color: value.trim() ? '#fff' : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
                            fontWeight: 700,
                            cursor: value.trim() ? 'pointer' : 'not-allowed',
                            boxShadow: value.trim() ? '0 10px 28px rgba(25,195,125,0.25)' : 'none'
                        },
                        children: "→"
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/Composer.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/chat/_components/Composer.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 10
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '7px 12px',
                        borderRadius: 999,
                        border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
                        background: 'rgba(255,255,255,0.74)',
                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textMute,
                        fontSize: 11
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].emerald
                            },
                            children: "↵"
                        }, void 0, false, {
                            fileName: "[project]/app/chat/_components/Composer.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        "Entrée pour envoyer · Maj + Entrée pour revenir à la ligne"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/chat/_components/Composer.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/chat/_components/Composer.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/chat/_components/Composer.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
function IconGhost({ children, title }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        "aria-label": title,
        title: title,
        style: {
            width: 38,
            height: 38,
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
            background: '#F6FAF6',
            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textMute,
            flexShrink: 0
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/chat/_components/Composer.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/chat/_components/LeftSidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeftSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_lib/chat.ts [app-ssr] (ecmascript)");
'use client';
;
;
function progressItemStyle(active = false) {
    return {
        display: 'grid',
        gridTemplateColumns: '18px 1fr',
        gap: 12,
        alignItems: 'start',
        opacity: active ? 1 : 0.72
    };
}
function LeftSidebar({ projects, readings, onNewChat, onCreateProject, onOpenReading }) {
    const latestReading = readings[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        style: {
            width: '100%',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            minHeight: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardStyle"])({
                    padding: 20,
                    borderRadius: 30
                }),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionLabel, {
                        children: "Progression"
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 18
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: progressItemStyle(true),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                        active: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                        lineNumber: 53,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: titleStyle,
                                                children: "Mode actif"
                                            }, void 0, false, {
                                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                                lineNumber: 55,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: subStyle,
                                                children: "Essentiel, Premium ou Praticien selon ton usage."
                                            }, void 0, false, {
                                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                                lineNumber: 56,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                        lineNumber: 54,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: progressItemStyle(readings.length > 0),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                        active: readings.length > 0
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                        lineNumber: 61,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: titleStyle,
                                                children: "Données personnelles"
                                            }, void 0, false, {
                                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                                lineNumber: 63,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: subStyle,
                                                children: "Date, heure, lieu et pays quand tu veux aller plus loin."
                                            }, void 0, false, {
                                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                                lineNumber: 64,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                        lineNumber: 62,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: progressItemStyle(readings.length > 0),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                        active: readings.length > 0
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                        lineNumber: 69,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: titleStyle,
                                                children: "Lectures générées"
                                            }, void 0, false, {
                                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                                lineNumber: 71,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: subStyle,
                                                children: [
                                                    readings.length,
                                                    " lecture",
                                                    readings.length > 1 ? 's' : '',
                                                    " enregistrée",
                                                    readings.length > 1 ? 's' : '',
                                                    "."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                                lineNumber: 72,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                        lineNumber: 70,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardStyle"])({
                    padding: 14,
                    borderRadius: 24
                }),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onNewChat,
                            style: primaryBtn,
                            children: "Nouveau chat"
                        }, void 0, false, {
                            fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCreateProject,
                            style: secondaryBtn,
                            children: "Nouveau projet"
                        }, void 0, false, {
                            fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardStyle"])({
                    padding: 18,
                    borderRadius: 30,
                    flex: 1
                }),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionLabel, {
                        children: "Projets / Lectures"
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        },
                        children: [
                            projects.length > 0 ? projects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
                                        borderRadius: 18,
                                        padding: '13px 14px',
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textSoft,
                                        background: '#ffffff',
                                        boxShadow: '0 6px 16px rgba(16,24,20,0.04)',
                                        fontSize: 14
                                    },
                                    children: project.name
                                }, project.id, false, {
                                    fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                    lineNumber: 95,
                                    columnNumber: 15
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
                                    fontSize: 14,
                                    lineHeight: 1.7,
                                    padding: '8px 2px 4px'
                                },
                                children: "Aucun projet créé pour le moment."
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this),
                            latestReading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onOpenReading(latestReading),
                                style: readingBtn,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 12,
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
                                            marginBottom: 5
                                        },
                                        children: "Dernière lecture"
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text
                                        },
                                        children: latestReading.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                        lineNumber: 119,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function SectionLabel({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
            marginBottom: 16,
            fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].monoFont
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
function Dot({ active = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: 18,
            height: 18,
            borderRadius: 999,
            border: `1px solid ${active ? 'rgba(25,195,125,0.46)' : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].lineStrong}`,
            boxShadow: active ? '0 0 0 4px rgba(25,195,125,0.10)' : 'none',
            display: 'grid',
            placeItems: 'center',
            marginTop: 2,
            background: '#fff'
        },
        children: active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: 7,
                height: 7,
                borderRadius: 999,
                background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].emerald
            }
        }, void 0, false, {
            fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
            lineNumber: 160,
            columnNumber: 18
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/chat/_components/LeftSidebar.tsx",
        lineNumber: 147,
        columnNumber: 5
    }, this);
}
const titleStyle = {
    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
    fontSize: 15,
    fontWeight: 700
};
const subStyle = {
    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textMuted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 1.6
};
const primaryBtn = {
    border: 'none',
    background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].gradient,
    color: '#fff',
    borderRadius: 18,
    padding: '13px 14px',
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'left',
    boxShadow: '0 12px 28px rgba(25,195,125,0.20)'
};
const secondaryBtn = {
    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
    background: 'rgba(255,255,255,0.84)',
    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textSoft,
    borderRadius: 18,
    padding: '13px 14px',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'left'
};
const readingBtn = {
    marginTop: 6,
    border: '1px solid rgba(25,195,125,0.14)',
    background: 'rgba(25,195,125,0.06)',
    borderRadius: 18,
    padding: '14px 14px',
    textAlign: 'left',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(25,195,125,0.06)'
};
}),
"[project]/app/chat/_components/MessageBubble.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MessageBubble
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_lib/chat.ts [app-ssr] (ecmascript)");
'use client';
;
;
function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: 'min(760px, 86%)',
                padding: '16px 18px',
                borderRadius: 24,
                background: isUser ? 'rgba(25,195,125,0.12)' : 'rgba(255,255,255,0.86)',
                border: `1px solid ${isUser ? 'rgba(25,195,125,0.20)' : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
                boxShadow: isUser ? '0 10px 28px rgba(25,195,125,0.10)' : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].shadowSoft,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
                lineHeight: 1.8,
                fontSize: 15,
                whiteSpace: 'pre-wrap'
            },
            children: message.content
        }, void 0, false, {
            fileName: "[project]/app/chat/_components/MessageBubble.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/chat/_components/MessageBubble.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/chat/_components/MessageList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MessageList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_lib/chat.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$MessageBubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_components/MessageBubble.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function MessageList({ messages, isTyping }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            maxWidth: 980,
            margin: '0 auto',
            paddingBottom: 18
        },
        children: [
            messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$MessageBubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    message: message
                }, message.id, false, {
                    fileName: "[project]/app/chat/_components/MessageList.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)),
            isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'flex-start'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '14px 16px',
                        borderRadius: 22,
                        background: 'rgba(255,255,255,0.84)',
                        border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
                        boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].shadowSoft
                    },
                    children: [
                        0,
                        1,
                        2
                    ].map((dot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                width: 7,
                                height: 7,
                                borderRadius: 999,
                                background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].emerald,
                                opacity: 0.35 + dot * 0.18
                            }
                        }, dot, false, {
                            fileName: "[project]/app/chat/_components/MessageList.tsx",
                            lineNumber: 42,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/chat/_components/MessageList.tsx",
                    lineNumber: 29,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/chat/_components/MessageList.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/chat/_components/MessageList.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/chat/_components/RightPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RightPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_lib/chat.ts [app-ssr] (ecmascript)");
'use client';
;
;
const personalDataItems = [
    {
        title: 'Date de naissance',
        value: 'À compléter'
    },
    {
        title: 'Heure de naissance',
        value: 'À compléter'
    },
    {
        title: 'Lieu de naissance',
        value: 'À compléter'
    },
    {
        title: 'Profil actuel',
        value: 'Mode Essentiel'
    }
];
const categories = [
    {
        title: 'État intérieur',
        subtitle: 'Lire ce qui pèse ou s’ouvre',
        prompt: 'Analyse mon état intérieur du moment avec HexAstra.'
    },
    {
        title: 'Énergie du moment',
        subtitle: 'Tendance de fond et timing',
        prompt: 'Quelle est mon énergie dominante en ce moment ?'
    },
    {
        title: 'Amour / Relations',
        subtitle: 'Comprendre la dynamique affective',
        prompt: 'Aide-moi à comprendre ma dynamique relationnelle actuelle.'
    },
    {
        title: 'Travail / Argent',
        subtitle: 'Stabilité, mouvement, clarté',
        prompt: 'Analyse ma zone travail et argent en ce moment.'
    },
    {
        title: 'Lecture générale',
        subtitle: 'Vue synthétique de la situation',
        prompt: 'Fais-moi une lecture générale claire de ma situation actuelle.'
    }
];
function RightPanel({ mode, readings, collapsed, onToggleCollapse, onPrompt, onOpenReading }) {
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            style: {
                width: 72,
                display: 'flex',
                justifyContent: 'center'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggleCollapse,
                style: collapseBtn,
                children: "›"
            }, void 0, false, {
                fileName: "[project]/app/chat/_components/RightPanel.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/chat/_components/RightPanel.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        style: {
            width: '100%',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 14
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: sectionLabel,
                        children: "Outils"
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onToggleCollapse,
                        style: collapseBtn,
                        children: "‹"
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/chat/_components/RightPanel.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardStyle"])({
                    padding: 18,
                    borderRadius: 30
                }),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: sectionLabel,
                        children: "Données personnelles"
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        },
                        children: personalDataItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: infoCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
                                            fontSize: 14,
                                            fontWeight: 700
                                        },
                                        children: item.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
                                            fontSize: 13,
                                            marginTop: 4
                                        },
                                        children: item.value
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, item.title, true, {
                                fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/chat/_components/RightPanel.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardStyle"])({
                    padding: 18,
                    borderRadius: 30,
                    flex: 1
                }),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: sectionLabel,
                        children: "Raccourcis"
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        },
                        children: categories.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onPrompt(item.prompt),
                                style: promptBtn,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
                                            fontSize: 15,
                                            fontWeight: 700
                                        },
                                        children: item.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                        lineNumber: 93,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textMuted,
                                            fontSize: 13,
                                            marginTop: 4
                                        },
                                        children: item.subtitle
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, item.title, true, {
                                fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    readings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 16
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: sectionLabel,
                                children: "Dernières lectures"
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8
                                },
                                children: readings.slice(0, 3).map((reading)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onOpenReading(reading),
                                        style: lastReadingBtn,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 14,
                                                    fontWeight: 700
                                                },
                                                children: reading.title
                                            }, void 0, false, {
                                                fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                                lineNumber: 105,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 12,
                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
                                                    marginTop: 4
                                                },
                                                children: [
                                                    mode,
                                                    " · ",
                                                    new Date(reading.date).toLocaleDateString('fr-FR')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                                lineNumber: 106,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, reading.id, true, {
                                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                        lineNumber: 104,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/RightPanel.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/chat/_components/RightPanel.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/chat/_components/RightPanel.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/chat/_components/RightPanel.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
const sectionLabel = {
    fontSize: 10,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
    marginBottom: 14,
    fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].monoFont
};
const collapseBtn = {
    width: 40,
    height: 40,
    borderRadius: 14,
    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
    background: 'rgba(255,255,255,0.84)',
    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
    boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].shadowSoft
};
const infoCard = {
    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
    borderRadius: 18,
    padding: '12px 14px',
    background: '#ffffff'
};
const promptBtn = {
    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
    borderRadius: 18,
    padding: '14px 14px',
    background: '#ffffff',
    textAlign: 'left',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(16,24,20,0.04)'
};
const lastReadingBtn = {
    border: '1px solid rgba(25,195,125,0.12)',
    borderRadius: 16,
    padding: '12px 14px',
    background: 'rgba(25,195,125,0.06)',
    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textSoft,
    textAlign: 'left',
    cursor: 'pointer'
};
}),
"[project]/app/chat/_components/WelcomeHero.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WelcomeHero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_lib/chat.ts [app-ssr] (ecmascript)");
'use client';
;
;
const quickPrompts = [
    'Je me sens bloqué en ce moment',
    'Est-ce le bon timing pour agir ?',
    'Pourquoi cette relation me travaille autant ?',
    'Quelle direction devient plus naturelle ?'
];
const entryCards = [
    {
        title: 'Clarté immédiate',
        text: 'Tu poses ton ressenti, ton dilemme ou ta question. HexAstra commence simple, sans te noyer dans la matière.'
    },
    {
        title: 'Lecture guidée',
        text: 'Le système approfondit seulement quand c’est utile. L’expérience reste légère, même si le moteur est dense.'
    },
    {
        title: 'Confort durable',
        text: 'L’interface est pensée pour rester longtemps sans fatigue visuelle, mentale ou émotionnelle.'
    }
];
function WelcomeHero({ onPrompt }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "hx-welcome-grid",
        style: {
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.14fr) minmax(340px, 0.86fr)',
            gap: 18,
            alignItems: 'stretch'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardStyle"])({
                    padding: '34px 32px 28px',
                    borderRadius: 34,
                    minHeight: 560,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 10,
                                    letterSpacing: '0.24em',
                                    textTransform: 'uppercase',
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
                                    marginBottom: 18,
                                    fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].monoFont
                                },
                                children: "Interface de clarté assistée par IA"
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 44,
                                    height: 44,
                                    borderRadius: 16,
                                    background: 'linear-gradient(135deg,#19C37D,#0E8F5B)',
                                    marginBottom: 18,
                                    boxShadow: '0 12px 30px rgba(25,195,125,0.24)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    margin: 0,
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
                                    fontSize: 'clamp(3rem, 6.2vw, 5.25rem)',
                                    lineHeight: 0.95,
                                    letterSpacing: '-0.065em',
                                    maxWidth: 760,
                                    fontWeight: 700,
                                    fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].titleFont
                                },
                                children: [
                                    "Un espace clair",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this),
                                    "pour retrouver",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this),
                                    "de l’air intérieur."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    margin: '24px 0 0',
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textSoft,
                                    fontSize: 18,
                                    lineHeight: 1.85,
                                    maxWidth: 720
                                },
                                children: "HexAstra t’aide à lire ton moment sans te noyer dans la complexité. Tu commences par parler. Le système écoute, clarifie, puis approfondit seulement si c’est nécessaire."
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 10,
                                    flexWrap: 'wrap',
                                    marginTop: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onPrompt('Je veux une lecture claire de ma situation actuelle.'),
                                        style: primaryButton,
                                        children: "Commencer maintenant"
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                        lineNumber: 109,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onPrompt('Explique-moi comment fonctionne HexAstra Coach.'),
                                        style: secondaryButton,
                                        children: "Comprendre le fonctionnement"
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 10,
                                    flexWrap: 'wrap',
                                    marginTop: 18
                                },
                                children: quickPrompts.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onPrompt(item),
                                        className: "hx-chip",
                                        children: item
                                    }, item, false, {
                                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hx-welcome-points",
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                            gap: 12,
                            marginTop: 28
                        },
                        children: entryCards.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
                                    borderRadius: 22,
                                    padding: '18px 16px',
                                    background: 'rgba(255,255,255,0.66)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
                                            fontWeight: 700,
                                            fontSize: 15
                                        },
                                        children: item.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textMuted,
                                            fontSize: 13,
                                            lineHeight: 1.7,
                                            marginTop: 8
                                        },
                                        children: item.text
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, item.title, true, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardStyle"])({
                    padding: 0,
                    borderRadius: 34,
                    minHeight: 560,
                    overflow: 'hidden'
                }),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '16px 18px',
                            borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 10,
                                            letterSpacing: '0.22em',
                                            textTransform: 'uppercase',
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
                                            fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].monoFont
                                        },
                                        children: "Aperçu du chat"
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
                                            fontSize: 16,
                                            fontWeight: 700,
                                            marginTop: 4
                                        },
                                        children: "Conversation en direct"
                                    }, void 0, false, {
                                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                        lineNumber: 175,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].emerald,
                                    fontSize: 13,
                                    fontWeight: 700
                                },
                                children: "En ligne"
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: 18,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            minHeight: 470,
                            justifyContent: 'center',
                            background: 'linear-gradient(180deg, rgba(241,246,241,0.20), rgba(255,255,255,0.45))'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PreviewBubble, {
                                children: "Bienvenue. Dis-moi ce que tu veux comprendre, trancher ou mieux sentir aujourd’hui."
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PreviewBubble, {
                                user: true,
                                children: "J’hésite entre continuer mon activité actuelle ou lancer autre chose."
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PreviewBubble, {
                                children: "On peut clarifier cela en 3 temps : ton état actuel, le vrai nœud de décision, puis le bon timing d’action."
                            }, void 0, false, {
                                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function PreviewBubble({ children, user = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            alignSelf: user ? 'flex-end' : 'flex-start',
            maxWidth: user ? '72%' : '78%',
            borderRadius: 20,
            padding: '14px 16px',
            background: user ? 'rgba(25,195,125,0.12)' : 'rgba(255,255,255,0.84)',
            border: `1px solid ${user ? 'rgba(25,195,125,0.18)' : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
            lineHeight: 1.75,
            fontSize: 14,
            boxShadow: user ? '0 10px 24px rgba(25,195,125,0.08)' : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].shadowSoft
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/chat/_components/WelcomeHero.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
const primaryButton = {
    border: 'none',
    cursor: 'pointer',
    padding: '14px 22px',
    borderRadius: 18,
    background: 'linear-gradient(135deg,#19C37D,#0E8F5B)',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 14,
    boxShadow: '0 12px 30px rgba(25,195,125,0.18)'
};
const secondaryButton = {
    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].line}`,
    cursor: 'pointer',
    padding: '14px 22px',
    borderRadius: 18,
    background: 'rgba(255,255,255,0.72)',
    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].text,
    fontWeight: 600,
    fontSize: 14
};
}),
"[project]/app/chat/_components/ChatPageClient.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatPageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$ChatShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_components/ChatShell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$ChatHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_components/ChatHeader.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$Composer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_components/Composer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$LeftSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_components/LeftSidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$MessageList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_components/MessageList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$RightPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_components/RightPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$WelcomeHero$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_components/WelcomeHero.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/chat/_lib/chat.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
const WELCOME_MESSAGE = {
    id: 'welcome',
    role: 'assistant',
    content: '__welcome__',
    created_at: new Date().toISOString()
};
function ChatPageClient() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        WELCOME_MESSAGE
    ]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('essentiel');
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [conversationId, setConversationId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [readings, setReadings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [projects, setProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showLeft, setShowLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRight, setShowRight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rightCollapsed, setRightCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewportWidth, setViewportWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1600);
    const [userEmail, setUserEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const cacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const hasPrefilled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const isWelcome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>messages.length === 1 && messages[0]?.content === '__welcome__', [
        messages
    ]);
    const desktopLeft = viewportWidth >= 1180;
    const desktopRight = viewportWidth >= 1480;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        supabase.auth.getUser().then(({ data })=>{
            if (data.user?.email) setUserEmail(data.user.email);
        });
    }, [
        supabase
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const onResize = undefined;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (viewportWidth < 1480) return;
        setRightCollapsed(viewportWidth < 1640);
    }, [
        viewportWidth
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const storedReadings = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].readings);
            const storedProjects = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].projects);
            if (storedReadings) setReadings(JSON.parse(storedReadings));
            if (storedProjects) setProjects(JSON.parse(storedProjects));
        } catch  {
        // ignore invalid local storage
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const q = searchParams.get('q');
        if (!q || hasPrefilled.current) return;
        hasPrefilled.current = true;
        setInput(q);
    }, [
        searchParams
    ]);
    const persistReadings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((next)=>{
        setReadings(next);
        localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].readings, JSON.stringify(next));
    }, []);
    const persistProjects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((next)=>{
        setProjects(next);
        localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].projects, JSON.stringify(next));
    }, []);
    const saveReading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((conversation)=>{
        const lastAssistant = [
            ...conversation
        ].reverse().find((item)=>item.role === 'assistant');
        const firstUser = conversation.find((item)=>item.role === 'user');
        if (!lastAssistant || !firstUser) return;
        const reading = {
            id: `${Date.now()}`,
            title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeReadingTitle"])(firstUser.content),
            science: mode === 'essentiel' ? 'Mode Essentiel' : mode === 'premium' ? 'Mode Premium' : 'Mode Praticien',
            date: new Date().toISOString(),
            preview: lastAssistant.content.slice(0, 120)
        };
        persistReadings([
            reading,
            ...readings
        ].slice(0, 80));
    }, [
        mode,
        persistReadings,
        readings
    ]);
    const handleNewChat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setMessages([
            WELCOME_MESSAGE
        ]);
        setInput('');
        setIsTyping(false);
        setConversationId(null);
        setShowLeft(false);
        setShowRight(false);
    }, []);
    const handleCreateProject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const name = window.prompt('Nom du nouveau projet')?.trim();
        if (!name) return;
        const nextProject = {
            id: `${Date.now()}`,
            name,
            collapsed: false
        };
        persistProjects([
            ...projects,
            nextProject
        ]);
    }, [
        persistProjects,
        projects
    ]);
    const handleOpenReading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((reading)=>{
        setMessages([
            {
                id: `reading-${reading.id}`,
                role: 'assistant',
                created_at: reading.date,
                content: `Lecture : ${reading.title}\n\n${reading.preview}`
            }
        ]);
        setShowLeft(false);
        setShowRight(false);
    }, []);
    const handleSend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (provided)=>{
        const content = (provided ?? input).trim();
        if (!content) return;
        const nextUserMessage = {
            id: `${Date.now()}`,
            role: 'user',
            content,
            created_at: new Date().toISOString()
        };
        const baseMessages = isWelcome ? [] : messages;
        const nextConversation = [
            ...baseMessages,
            nextUserMessage
        ];
        setMessages(nextConversation);
        setInput('');
        setIsTyping(true);
        setShowLeft(false);
        setShowRight(false);
        if (cacheRef.current.has(content)) {
            const cachedReply = cacheRef.current.get(content);
            const assistantMessage = {
                id: `${Date.now()}-cached`,
                role: 'assistant',
                content: cachedReply,
                created_at: new Date().toISOString(),
                cached: true
            };
            const finalConversation = [
                ...nextConversation,
                assistantMessage
            ];
            setTimeout(()=>{
                setMessages(finalConversation);
                setIsTyping(false);
                saveReading(finalConversation);
            }, 220);
            return;
        }
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: nextConversation.map((message)=>({
                            role: message.role,
                            content: message.content
                        })),
                    mode,
                    conversationId
                })
            });
            const data = await response.json();
            if (data?.conversationId) setConversationId(data.conversationId);
            const reply = data?.reply || 'Une erreur est survenue.';
            if (content.length < 220) {
                cacheRef.current.set(content, reply);
            }
            const assistantMessage = {
                id: `${Date.now()}-ai`,
                role: 'assistant',
                content: reply,
                created_at: new Date().toISOString()
            };
            const finalConversation = [
                ...nextConversation,
                assistantMessage
            ];
            setMessages(finalConversation);
            setIsTyping(false);
            saveReading(finalConversation);
        } catch (error) {
            console.error('Chat send error:', error);
            const fallbackMessage = {
                id: `${Date.now()}-error`,
                role: 'assistant',
                content: 'Erreur de connexion. Réessaie dans un instant.',
                created_at: new Date().toISOString()
            };
            setMessages([
                ...nextConversation,
                fallbackMessage
            ]);
            setIsTyping(false);
        }
    }, [
        conversationId,
        input,
        isWelcome,
        messages,
        mode,
        saveReading
    ]);
    const left = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$LeftSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        projects: projects,
        readings: readings,
        onNewChat: handleNewChat,
        onCreateProject: handleCreateProject,
        onOpenReading: handleOpenReading
    }, void 0, false, {
        fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
        lineNumber: 252,
        columnNumber: 5
    }, this);
    const right = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$RightPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        mode: mode,
        readings: readings,
        collapsed: rightCollapsed,
        onToggleCollapse: ()=>setRightCollapsed((value)=>!value),
        onPrompt: (value)=>void handleSend(value),
        onOpenReading: handleOpenReading
    }, void 0, false, {
        fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
        lineNumber: 262,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$ChatShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        left: left,
        right: right,
        showLeft: showLeft,
        showRight: showRight,
        onCloseLeft: ()=>setShowLeft(false),
        onCloseRight: ()=>setShowRight(false),
        desktopLeft: desktopLeft,
        desktopRight: desktopRight,
        header: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$ChatHeader$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            mode: mode,
            onModeChange: setMode,
            onOpenLeft: ()=>setShowLeft(true),
            onOpenRight: ()=>setShowRight(true),
            desktopLeft: desktopLeft,
            desktopRight: desktopRight
        }, void 0, false, {
            fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
            lineNumber: 283,
            columnNumber: 9
        }, void 0),
        body: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: isWelcome ? 1280 : 1080,
                margin: '0 auto',
                minHeight: '100%'
            },
            children: [
                isWelcome ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$WelcomeHero$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    onPrompt: (value)=>void handleSend(value)
                }, void 0, false, {
                    fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
                    lineNumber: 295,
                    columnNumber: 13
                }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$MessageList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    messages: messages,
                    isTyping: isTyping
                }, void 0, false, {
                    fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
                    lineNumber: 297,
                    columnNumber: 13
                }, void 0),
                !isWelcome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 18
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardStyle"])({
                            maxWidth: 920,
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 999,
                            boxShadow: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].shadowSoft,
                            background: 'rgba(255,255,255,0.78)'
                        }),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 10,
                                flexWrap: 'wrap'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 9,
                                        color: 'rgba(25,195,125,0.72)',
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        border: '1px solid rgba(25,195,125,0.12)',
                                        padding: '4px 10px',
                                        borderRadius: 999,
                                        fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].monoFont
                                    },
                                    children: mode
                                }, void 0, false, {
                                    fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
                                    lineNumber: 321,
                                    columnNumber: 19
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        flex: 1,
                                        margin: 0,
                                        textAlign: 'center',
                                        fontSize: 11,
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
                                        lineHeight: 1.7,
                                        fontStyle: 'italic'
                                    },
                                    children: userEmail || 'Session locale'
                                }, void 0, false, {
                                    fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
                                    lineNumber: 336,
                                    columnNumber: 19
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
                            lineNumber: 312,
                            columnNumber: 17
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
                        lineNumber: 302,
                        columnNumber: 15
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
                    lineNumber: 301,
                    columnNumber: 13
                }, void 0)
            ]
        }, void 0, true, {
            fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
            lineNumber: 293,
            columnNumber: 9
        }, void 0),
        composer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 10
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_components$2f$Composer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    value: input,
                    onChange: setInput,
                    onSend: ()=>void handleSend(),
                    onQuickPrompt: (value)=>void handleSend(value),
                    showQuickPrompts: !isWelcome
                }, void 0, false, {
                    fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
                    lineNumber: 357,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        fontSize: 12,
                        lineHeight: 1.7,
                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$chat$2f$_lib$2f$chat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DS"].textFaint,
                        fontStyle: 'italic',
                        paddingBottom: 2
                    },
                    children: "HexAstra Coach est un outil d’exploration et de réflexion personnelle. Il ne remplace pas un avis médical, juridique ou financier."
                }, void 0, false, {
                    fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
                    lineNumber: 365,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true, {
            fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
            lineNumber: 356,
            columnNumber: 9
        }, void 0)
    }, void 0, false, {
        fileName: "[project]/app/chat/_components/ChatPageClient.tsx",
        lineNumber: 273,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dcd10867._.js.map