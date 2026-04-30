<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//app routes(open)
use App\Http\Controllers\ExamDateController;

//payments
use App\Http\Controllers\Payments\PaymentController;
use App\Http\Controllers\Payments\Stripe\StripeController;
use App\Http\Controllers\Payments\Stripe\StripeWebhookController;
use App\Http\Controllers\Payments\PlanController;
use App\Http\Controllers\Payments\SubscriptionController;
use App\Http\Controllers\Payments\Paypal\PaypalController;
use App\Http\Controllers\Payments\Paypal\PaypalWebhookController;

// Auth
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\PasswordResetController;

//Nursing
use App\Http\Controllers\Nursing\Exam\NursingExamController;
use App\Http\Controllers\Nclex\MainNclexController;
use App\Http\Controllers\Nursing\MainNursingController;
use App\Http\Controllers\Nclex\NclexExamController;

//Teas
use App\Http\Controllers\Teas\TeasTopicController;
use App\Http\Controllers\Teas\TeasExamController;

//Account
use App\Http\Controllers\AccountController;

// admin
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Teas\MainTeasController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Nclex\NclexTopicController;
use App\Http\Controllers\Nursing\Study\StudyController;


use App\Http\Controllers\QuestionIndexing;
use App\Http\Controllers\UserSettingsController;
use App\Http\Controllers\ExamFeedbackController;

//app routes(open)

Route::post('/login', [LoginController::class, 'login']);
Route::post('/create-client-account', [RegisterController::class, 'register']);
Route::post('/check-email', [LoginController::class, 'checkEmail']);
Route::post('/password/forgot', [PasswordResetController::class, 'requestReset']);
Route::post('/password/reset', [PasswordResetController::class, 'reset']);
Route::post('/email/verify', [EmailVerificationController::class, 'verifyEmail']);
Route::post('/password-reset/confirm', [PasswordResetController::class, 'resetConfirm']);
Route::post('/verify-email/confirm', [EmailVerificationController::class, 'verifyEmailConfirm']);

//stripe webhook
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);
//paypal webhook
Route::post('/paypal/webhook', [PaypalWebhookController::class, 'handle']);



//subscriptions and plans

Route::apiResource('plans', PlanController::class);

Route::post('subscribe', [SubscriptionController::class, 'subscribe']);

Route::post('cancel-subscription/{id}', [SubscriptionController::class, 'cancel']);
Route::post('renew-subscription/{id}', [SubscriptionController::class, 'renew']);

//for indexed qns

Route::get('/nursing/questions', [QuestionIndexing::class, 'indexNursingQuestions']);
Route::get('/teas/questions', [QuestionIndexing::class, 'indexTeasQuestions']);


//start Protected routes
Route::middleware('auth:sanctum')->group(function () {
    //create payments 
    Route::prefix('payments')->group(function () {
        Route::post('/create-payment-intent', [StripeController::class, 'createPaymentIntent']);
        Route::get('check-access', [SubscriptionController::class, 'checkAccess']);
        Route::get('/', [PaymentController::class, 'index']); // /api/payments
        Route::get('/payment/{id?}', [PaymentController::class, 'show']); // /api/payments/payment OR /api/payments/payment/{id}
        Route::post('/paypal/create-payment-intent', [PaypalController::class, 'createPaymentIntent']);
        Route::post('/paypal/capture-payment', [PaypalController::class, 'capturePayment']);
    });
    //user account
    Route::post('/account', [AccountController::class, 'update']);
    Route::get('/settings', [UserSettingsController::class, 'show']);
    Route::put('/settings', [UserSettingsController::class, 'update']);
    Route::post('/settings/reset', [UserSettingsController::class, 'reset']);
    Route::post('/exam-feedback', [ExamFeedbackController::class, 'store']);

    Route::post('/exam-dates', [ExamDateController::class, 'store']);
    Route::get('/exam-dates', [ExamDateController::class, 'index']);

    //logout user 
    Route::post('/logout', [LogoutController::class, 'logout']);


    //exams
    Route::group(['prefix' => 'nursing'], function () {

        Route::get('/dashdata', [MainNursingController::class, 'dashData']);
        Route::get('/exams', [NursingExamController::class, 'index']);
        Route::get('/subjects', [NursingExamController::class, 'getSubjects']);
        Route::get('/chapters/{id}', [StudyController::class, 'getChapters']);
        Route::get('/exam/{id}', [NursingExamController::class, 'showByTitle']);
        Route::post('/exam-attempts', [NursingExamController::class, 'store']);
        Route::get('/exam-attempts/{id}', [NursingExamController::class, 'review_attempt']);
        Route::get('/resume-attempt/{id}', [NursingExamController::class, 'resume_attempt']);
        Route::get('/exam-subjects/{slug}', [NursingExamController::class, 'getExamSubjects']);
        Route::get('/exam-subtopics-per-subject/{slug}', [NursingExamController::class, 'getSubtopicsPerSubject']);
        Route::get('/previous-attempts', [NursingExamController::class, 'previous_attempts']);
        Route::get('/performance-report/{attemptId}', [NursingExamController::class, 'performance_report']);
        //study materials
        Route::get('/study-topic/{topicId}/sub-chapters', [StudyController::class, 'getTopics']);
        Route::get('/lessons/{sub_topic_id}', [StudyController::class, 'getSubtopicLessons']);
        //search topics
        Route::get('/search/subtopics', [NursingExamController::class, 'searchExamSubtopics']);
    });

    Route::group(['prefix' => 'teas'], function () {
        Route::get('/dashdata', [MainTeasController::class, 'dashData']);
        Route::get('/exam-topics-per-subject/{slug}', [TeasTopicController::class, 'getTopicsBySubject']);
        Route::get('/study-chapters', [TeasTopicController::class, 'getGuideChapters']);
        Route::post('/exam-attempts', [TeasExamController::class, 'store_attempt']);
        Route::get('/exam-attempts/{id}', [TeasExamController::class, 'review_attempt']);
        Route::get('/resume-attempt/{id}', [TeasExamController::class, 'resume_attempt']);
        Route::get('/exam/{id}', [TeasExamController::class, 'showByTitle']);
        Route::get('/previous-attempts', [TeasExamController::class, 'previous_attempts']);
        Route::get('/performance-report/{attemptId}', [TeasExamController::class, 'performance_report']);
    });

    Route::group(['prefix' => 'nclex'], function () {
        Route::get('/dashdata', [MainNclexController::class, 'dashData']);
        Route::get('/readiness', [NclexTopicController::class, 'readiness']);
        Route::get('/mock', [NclexTopicController::class, 'mock']);
        Route::get('/exam/{id}', [NclexExamController::class, 'showByTitle']);
        Route::post('/exam-attempts', [NclexExamController::class, 'store_attempt']);
        Route::get('/exam-attempts/{id}', [NclexExamController::class, 'review_attempt']);
        Route::get('/previous-attempts', [NclexExamController::class, 'previous_attempts']);
        Route::get('/performance-report/{attemptId}', [NclexExamController::class, 'performance_report']);

        // CAT (Computerized Adaptive Testing) Routes
        Route::get('/adaptive-exam', [NclexExamController::class, 'getAdaptiveExam']);
        Route::post('/cat-attempts', [NclexExamController::class, 'storeCATAttempt']);
        Route::get('/cat-attempts', [NclexExamController::class, 'getCATAttempts']);
        Route::get('/cat-attempts/{id}', [NclexExamController::class, 'getCATAttempt']);
    });

    Route::prefix('admin')->group(function () {
        Route::get('/dashdata', [AdminController::class, 'dashData']);
        // User Management Routes
        Route::post('/users', [AdminController::class, 'usersPerProductOrAll']);
        //Route::post('/users', [UsersController::class, 'store']);
        Route::get('/users/{id}', [UsersController::class, 'show']);
        Route::put('/users/{id}', [UsersController::class, 'update']);
        Route::delete('/user/{id}', [UsersController::class, 'destroy']);
        route::get('user/roles', [UsersController::class, 'getAllRoles']);
        route::get('user/permissions', [UsersController::class, 'getAllPermissions']);

        Route::put('/users/{user}/permissions', [UsersController::class, 'updateUserPermissions']);

        Route::get('teas-payments', [AdminController::class, 'teasPayments']);

        Route::get('nursing-payments', [AdminController::class, 'nursingPayments']);

        Route::get('nclex-payments', [AdminController::class, 'nclexPayments']);

        Route::post('signups-filter', [AdminController::class, 'filterSignups']);
        Route::get('exam-feedback', [AdminController::class, 'examFeedback']);
    });
});


//generate sitemap
Route::get('/generate-sitemap', [QuestionIndexing::class, 'sitemap']);

//update question slugs (linkGenerator)
Route::get('/update-slugs', [QuestionIndexing::class, 'linkGenerator']);

//update subtopic slugs (linkGenerator)
Route::get('/update-subtopic-slugs', [QuestionIndexing::class, 'subtopicLinkGenerator']);
