<?php

namespace App\Http\Controllers;

use App\Http\Traits\JsonResponseTrait;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController

{
    use JsonResponseTrait;
}
