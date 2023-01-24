<?php namespace October\DemoOnboarding;

use Backend;
use Event;
use Block;
use Config;
use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public function pluginDetails()
    {
        return [
            'name'        => 'Demo Onboarding',
            'description' => 'Provides onboarding experience for Demo users.',
            'author'      => 'Alexey Bobkov, Samuel Georges',
            'icon'        => 'icon-leaf'
        ];
    }

    public function boot()
    {
        Event::listen('backend.page.beforeDisplay', function ($controller, $action, $params) {
            $controller->addJs('/plugins/october/demoonboarding/assets/js/popup.js');
            $controller->addCss('/plugins/october/demoonboarding/assets/css/onboarding.css');
        });
    }

    public function register()
    {
    }
}
