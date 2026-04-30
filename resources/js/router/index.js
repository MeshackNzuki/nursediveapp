import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const routes = [
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/auth/Login.vue"),
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/auth/Register.vue"),
    },
    {
        path: "/reset-password",
        name: "ResetPassword",
        component: () => import("../views/auth/ResetPassword.vue"),
    },
    {
        path: "/email-verification",
        name: "EmailVerification",
        component: () => import("../views/EmailVerification.vue"),
    },
    {
        path: "/welcome",
        name: "Welcome",
        component: () => import("../views/Welcome.vue"),
    },
    {
        path: "/",
        name: "Usher",
        component: () => import("../views/Usher.vue"),
    },
    {
        path: "/checkout",
        name: "Checkout",
        component: () => import("../views/Checkout.vue"),
    },
    {
        path: "/paypal-checkout",
        name: "PayPalCheckout",
        component: () => import("../views/Paypal.vue"),
    },
    {
        path: "/order-complete",
        name: "OrderComplete",
        component: () => import("../views/OrderCompleted.vue"),
    },
    {
        path: "/404",
        name: "404",
        component: () => import("../views/404.vue"),
    },
    {
        path: "/notifications",
        name: "Notifications",
        component: () => import("../views/Notifications.vue"),
    },

    {
        path: "/account",
        name: "Account",
        component: () => import("../views/Account.vue"),
    },
    {
        path: "/subscription",
        name: "Subscription",
        component: () => import("../views/Subscription.vue"),
    },
    {
        path: "/teas-pricing",
        name: "TeasPricing",
        component: () => import("../views/TeasPricing.vue"),
    },
    {
        path: "/nursing-pricing",
        name: "NursingPricing",
        component: () => import("../views/NursingPricing.vue"),
    },
    {
        path: "/nclex-pricing",
        name: "NclexPricing",
        component: () => import("../views/NclexPricing.vue"),
    },
    {
        path: "/referral",
        name: "Referral",
        component: () => import("../views/Referral.vue"),
    },
    {
        path: "/checkout",
        name: "Checkout",
        component: () => import("../views/Checkout.vue"),
    },
    {
        path: "/settings",
        name: "Settings",
        component: () => import("../views/Settings.vue"),
    },
    {
        path: "/admin",
        name: "Admin",
        component: () => import("../views/admin/Layout.vue"),
        meta: { role: "admin" },
        children: [
            {
                path: "",
                name: "AdminDashboard",
                component: () => import("../views/admin/Dashboard.vue"),
            },
            {
                path: "users",
                name: "AdminUsers",
                component: () => import("../views/admin/Users.vue"),
            },
            {
                path: "teas-payments",
                name: "TeasPayments",
                component: () => import("../views/admin/TeasPayments.vue"),
            },
            {
                path: "nursing-payments",
                name: "NursingPayments",
                component: () => import("../views/admin/NursingPayments.vue"),
            },
            {
                path: "nclex-payments",
                name: "NclexPayments",
                component: () => import("../views/admin/NclexPayments.vue"),
            },

            {
                path: "all-payments",
                name: "AllPayments",
                component: () => import("../views/admin/AllPayments.vue"),
            },

            {
                path: "settings",
                name: "AdminSettings",
                component: () => import("../views/admin/Settings.vue"),
            },
            {
                path: "exam-feedback",
                name: "AdminExamFeedback",
                component: () => import("../views/admin/ExamFeedback.vue"),
            },
            {
                path: "tables",
                name: "AdminTables",
                component: () => import("../views/admin/Tables.vue"),
            },
        ],
    },
    {
        path: "/nursing",
        name: "Nursing",
        component: () => import("../views/nursing/Layout.vue"),
        meta: { role: "client" },
        children: [
            {
                path: "",
                name: "NursingDashboard",
                component: () => import("../views/nursing/Dashboard.vue"),
            },
            {
                path: "rn-t-exams",
                name: "rnExamsList-Nursing",
                component: () => import("../views/nursing/exam/RN.vue"),
            },
            {
                path: "lpn-t-exams",
                name: "lpn-ExamsList-Nursing",
                component: () => import("../views/nursing/exam/LPN.vue"),
            },
            {
                path: "exit-rn-exams",
                name: "exitExamsRNList-Nursing",
                component: () => import("../views/nursing/exam/ExitRN.vue"),
            },
            {
                path: "exit-pn-exams",
                name: "exitExamsPNList-Nursing",
                component: () => import("../views/nursing/exam/ExitLPN.vue"),
            },
            {
                path: "exam/:examId",
                name: "NursungExam-Nursing",
                component: () =>
                    import("../views/nursing/exam/ExamConsole.vue"),
                props: true,
            },
            {
                path: "test-bank-loader/:examId",
                name: "ClientRNPNExams-Nursing",
                component: () =>
                    import("../views/nursing/exam/TestbankLoader.vue"),
                props: true,
            },
            {
                path: "performance-report/:attemptId",
                name: "PerformanceReport-Nursing",
                component: () =>
                    import("../views/nursing/PerformanceReport.vue"),
                props: true,
            },
            {
                path: "performance-analysis",
                name: "PerformanceAnalysis-Nursing",
                component: () =>
                    import("../views/nursing/PerformanceAnalysis.vue"),
                props: true,
            },
            {
                path: "previous-attempts",
                name: "PreviousAttempts-Nursing",
                component: () =>
                    import("../views/nursing/PreviousAttempts.vue"),
                props: true,
            },
            {
                path: "study-chapters",
                name: "Study-Chapters-Nursing",
                component: () =>
                    import("../views/nursing/study/StudyChapters.vue"),
                props: true,
            },
            {
                path: "study-topics",
                name: "Study-Topics-Nursing",
                component: () =>
                    import("../views/nursing/study/StudyTopics.vue"),
                props: true,
            },
             {
                path: "lessons/:chapter_id",
                name: "Chapter-Lessons-Nursing",
                component: () =>
                    import("../views/nursing/study/LessonsRenderer.vue"),
                props: true,
            },
        ],
    },
    {
        path: "/teas",
        name: "Teas",
        component: () => import("../views/teas/Layout.vue"),
        meta: { role: "client" },
        children: [
            {
                path: "",
                name: "TeasDashboard",
                component: () => import("../views/teas/Dashboard.vue"),
            },
            {
                path: "test-bank-loader/:examId",
                name: "TeasTestbankLoader",
                component: () => import("../views/teas/TestbankLoader.vue"),
                props: true,
            },
            {
                path: "exam/:examId",
                name: "ClientTeasExam",
                component: () => import("../views/teas/exam/ExamConsole.vue"),
                props: true,
            },
            {
                path: "performance-report/:attemptId",
                name: "TeasPerformanceReport",
                component: () => import("../views/teas/PerformanceReport.vue"),
                props: true,
            },
            {
                path: "performance-analysis",
                name: "TeasPerformanceAnalysis",
                component: () =>
                    import("../views/teas/PerformanceAnalysis.vue"),
            },
            {
                path: "previous-attempts",
                name: "TeasPreviousAttempts",
                component: () => import("../views/teas/PreviousAttempts.vue"),
            },
            {
                path: "guide-topics",
                name: "TeasStudyTopics",
                component: () => import("../views/teas/Study/StudyTopics.vue"),
            },
            {
                path: "guide-chapters/:topicId",
                name: "TeasStudyChapters",
                component: () =>
                    import("../views/teas/Study/StudyChapters.vue"),
            },
        ],
    },
    {
        path: "/nclex",
        name: "Nclex",
        component: () => import("../views/nclex/Layout.vue"),
        children: [
            {
                path: "",
                name: "NclexDashboard",
                component: () => import("../views/nclex/Dashboard.vue"),
            },
            {
                path: "readiness",
                name: "Readiness",
                component: () => import("../views/nclex/exam/Readiness.vue"),
            },

            {
                path: "linear",
                name: "Linear",
                component: () => import("../views/nclex/exam/Linear.vue"),
            },
            {
                path: "cat",
                name: "Cat",
                component: () => import("../views/nclex/exam/CAT.vue"),
            },
            {
                path: "exam/cat",
                name: "CatExam",
                component: () => import("../components/CATExamRenderer.vue"),
                meta: { requiresNclexSubscription: true },
            },
            {
                path: "adaptive-report/:id",
                name: "AdaptiveReport",
                component: () => import("../views/nclex/AdaptiveTestReport.vue"),
                props: true,
                meta: { requiresNclexSubscription: true },
            },
            {
                path: "exam/:examId",
                name: "Exam-Nclex",
                component: () => import("../views/nclex/exam/ExamConsole.vue"),
                props: true,
            },
            {
                path: "performance-report/:attemptId",
                name: "PerformanceReport-Nclex",
                component: () => import("../views/nclex/PerformanceReport.vue"),
                props: true,
            },
            {
                path: "performance-analysis",
                name: "PerformanceAnalysis-Nclex",
                component: () =>
                    import("../views/nclex/PerformanceAnalysis.vue"),
                props: true,
            },
            {
                path: "previous-attempts",
                name: "PreviousAttempts-Nclex",
                component: () => import("../views/nclex/PreviousAttempts.vue"),
                props: true,
            },
            {
                path: "study-chapters",
                name: "Study-Chapters-Nclex",
                component: () =>
                    import("../views/nclex/study/StudyChapters.vue"),
                props: true,
            },
        ],
    },

    {
        path: "/unauthorized",
        name: "Unauthorized",
        component: () => import("../views/Unauthorized.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/404" },
];

const router = createRouter({
    linkActiveClass: "border-indigo-500",
    linkExactActiveClass: "border-indigo-700",
    history: createWebHistory("/"),
    routes,
});

router.beforeEach((to, from, next) => {
    const { user, is_authenticated, active, isTrial, pricingRoute } =
        useAuthStore();

    if (is_authenticated) {
        // Protect admin/super routes
        if (to.path.startsWith("/admin")) {
            const userRole = user?.roles?.[0];
            if (["super-admin", "admin"].includes(userRole)) {
                return next();
            }
            return next("/"); // redirect to home (or another safe page)
        }

        if (to.meta.requiresNclexSubscription) {
            if (active("nclex") && !isTrial("nclex")) {
                return next();
            } else {
                return next({
                    path: pricingRoute("nclex"),
                    query: { redirect: to.fullPath },
                });
            }
        }

        return next();
    } else if (["/login", "/register", "/reset-password"].includes(to.path)) {
        return next();
    } else {
        return next({
            path: "/login",
            query: { redirect: to.fullPath },
        });
    }
});

export default router;
