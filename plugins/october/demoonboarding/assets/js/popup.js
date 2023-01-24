+function ($) { "use strict";
    if (!$) {
        return;
    }

    var popupContents = [
        {
            title: 'Welcome to October CMS!<span class="onboarding-popup-emoji onboarding-popup-emoji-waving-hand">',
            content: '<p>In the Administration Area you can manage your website theme, make changes to content, and configure your website. Check out these tutorials to learn the basics of October CMS:</p><div class="onboarding-popup-video-tutorials"><a href="https://youtu.be/8Cu5AD7dNUo" target="_blank"><img src="https://octobercms-onboarding.s3.us-west-2.amazonaws.com/assets/images/october-themes-thumbnail.png" srcset="https://octobercms-onboarding.s3.us-west-2.amazonaws.com/assets/images/october-themes-thumbnail.png 1x, https://octobercms-onboarding.s3.us-west-2.amazonaws.com/assets/images/october-themes-thumbnail%402x.png 2x"/>October CMS Themes Basics</a> <a href="https://youtu.be/_WMH4mlMdjk" target="_blank"><img src="https://octobercms-onboarding.s3.us-west-2.amazonaws.com/assets/images/tailor-tutorial-thumbnail.png" srcset="https://octobercms-onboarding.s3.us-west-2.amazonaws.com/assets/images/tailor-tutorial-thumbnail.png 1x, https://octobercms-onboarding.s3.us-west-2.amazonaws.com/assets/images/tailor-tutorial-thumbnail%402x.png 2x"/>Tailor Blog<br/>Solution Tutorial</a></div><p>See also the <a href="https://youtu.be/RHUwCvo7xng" target="_blank">Installation Tutorial</a> if you want to install October CMS without Docker.</p>',
            button: 'Next: About the Docker Image'
        },
        {
            title: 'October CMS Docker Image',
            content: '<p>This Docker image is for development purposes. Until it is <a target="_blank" href="https://octobercms.com/docker-dev-image/convert-to-licensed">licensed</a>, it can only be used for evaluation needs. <a target="_blank" href="https://octobercms.com/docker-dev-image">Learn more</a> about the October CMS Development Docker Image.</p>',
            button: 'Next: Main Menu'
        },
        {
            title: 'Main Menu',
            content: '<p>Let’s take a quick look at the main menu items:</p><ul class="onboarding-popup-menu-items"><li class="menu-item-icon-dashboard"><strong>Dashboard</strong> - displays all the basic information about the system.</li><li class="menu-item-icon-editor"><strong>Editor</strong> - allows you to edit your website pages and manage custom content types with <a href="https://youtu.be/_WMH4mlMdjk" target="_blank">Tailor blueprints</a>.</li><li class="menu-item-icon-blog"><strong>Blog</strong> - a simple blog solution created with <a href="https://youtu.be/_WMH4mlMdjk" target="_blank">October CMS Tailor</a>.</li><li class="menu-item-icon-content"><strong>Content</strong> - edit the landing page and Wiki content. The landing page and Wiki are custom Tailor content types.</li><li class="menu-item-icon-media"><strong>Media</strong> - manage images and other files uploaded to your website.</li><li class="menu-item-icon-preview"><strong>Preview</strong> your website.</li></ul>',
            button: 'Next: Need Help?'
        },
        {
            title: 'Need help?',
            content: '<p>If you have questions about the October CMS platform, or about plans and pricing, email us at <a href="mailto:hello@octobercms.com">hello@octobercms.com</a> and we’ll be happy to help.</p>',
            button: 'Let\'s Get Started!'
        }
    ];

    var OnboardingPopup = function () {
        var $container = null,
            $collapsedWidget = null,
            currentPageIndex = 0;

        function build() {
            $container = $(
                '<div class="onboarding-popup-container-outer">' +
                    '<div class="onboarding-popup-container">' +
                        '<div class="onboarding-popup-header">'+
                            '<button class="onboarding-popup-collapse">-</button>' +
                            'October CMS' +
                        '</div>' +
                        '<div class="onboarding-popup-contents">' +
                            '<h4 class="onboarding-popup-content-title"></h4>' +
                            '<div class="onboarding-popup-content-text"></div>' +
                            '<div class="onboarding-popup-buttons">' +
                                '<button class="onboarding-popup-button button-prev" data-popup-ctrl="back"><span class="button-arrow-left"></span></button>' +
                                '<button class="onboarding-popup-button button-next" data-popup-ctrl="forward"></button>' +
                            '</div>' +
                            '<ul class="onboarding-popup-pages"></ul>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );

            $collapsedWidget = $('<div class="onboarding-popup-collapsed"><div></div></div>');
            
            var $pages = $container.find('.onboarding-popup-pages');
            for (var index = 0; index < popupContents.length; index++) {
                $pages.append('<li>●</li>');
            }

            $(document.body)
                .append($container)
                .append($collapsedWidget);
        }

        function init() {
            build();

            if (!getCollapsed()) {
                showPopup();
            }
            else {
                playCollapsedAnimation();
            }

            initListeners();
            showPage(getStartPageIndex());
        }

        function showPopup() {
            $(document.body).addClass('onboarding-popup-visible');

            window.setTimeout(function () {
                $container.addClass('onboarding-popup-container-visible');
            }, 5);
        }

        function initListeners() {
            $(document).on('focusin', function (ev) {
                if (!$(document.body).hasClass('onboarding-popup-visible')) {
                    return;
                }

                window.setTimeout(function () {
                    if (!document.activeElement) {
                        return;
                    }

                    if (!$container.get(0).contains(document.activeElement) ) {
                        document.activeElement.blur();
                    }
                });
            });

            $container.on('click', '[data-popup-ctrl=forward]', showNextPage);
            $container.on('click', '[data-popup-ctrl=back]', showPrevPage);
            $container.on('click', 'ul.onboarding-popup-pages li', onPageClick);
            $container.on('click', 'button.onboarding-popup-collapse', onCollapseClick);
            $(document).on('keydown', onKeyDown);
            $collapsedWidget.on('click', onCollapsedClick)
        }

        function showPage(pageIndex) {
            var page = popupContents[pageIndex];

            currentPageIndex = pageIndex;
            setStartPageIndex(pageIndex);

            $container.find('.onboarding-popup-content-title').html(page.title.replace('\n', '<br>'));
            $container.find('.onboarding-popup-content-text').html(page.content);
            
            var nextButtonHtml = page.button;
            if (currentPageIndex < popupContents.length - 1) {
                nextButtonHtml += '<span class="button-arrow-right"></span>';
            }

            $container.find('.onboarding-popup-button.button-next').html(nextButtonHtml);

            if (pageIndex == 0) {
                $container.find('.onboarding-popup-button.button-prev').attr('disabled', 'disabled');
            }
            else {
                $container.find('.onboarding-popup-button.button-prev').removeAttr('disabled');
            }

            var $pages = $container.find('.onboarding-popup-pages > li');
            $pages.removeClass('active');
            $($pages.get(pageIndex)).addClass('active');
        }

        function showNextPage() {
            var newPageIndex = currentPageIndex+1;
            if (newPageIndex > popupContents.length - 1) {
                newPageIndex = popupContents.length - 1;
            }

            if (currentPageIndex == popupContents.length - 1) {
                return onCollapseClick();
            }

            if (newPageIndex == currentPageIndex) {
                return;
            }

            showPage(newPageIndex);
        }

        function showPrevPage() {
            var newPageIndex = currentPageIndex-1;
            if (newPageIndex < 0) {
                newPageIndex = 0;
            }

            showPage(newPageIndex);
        }

        function onCollapseClick() {
            setCollapsed(true);
            $container.removeClass('onboarding-popup-container-visible');
            window.setTimeout(function () {
                $(document.body).removeClass('onboarding-popup-visible');
                playCollapsedAnimation();
            }, 200);
        }

        function playCollapsedAnimation() {
            $collapsedWidget.addClass('onboarding-popup-collapse-animation-start');
            window.setTimeout(function () {
                $collapsedWidget.addClass('onboarding-popup-just-collapsed');
                window.setTimeout(function () {
                    $collapsedWidget.removeClass('onboarding-popup-just-collapsed');
                    $collapsedWidget.removeClass('onboarding-popup-collapse-animation-start');
                }, 2000);
            }, 50);
        }

        function onCollapsedClick() {
            setCollapsed(false);
            showPopup();
        }

        function onPageClick(ev) {
            var index = $container.find('.onboarding-popup-pages li').index(ev.currentTarget);
            
            showPage(index);
        }

        function onKeyDown(ev) {
            if (ev.key === 'Escape' && $(document.body).hasClass('onboarding-popup-visible')) {
                onCollapseClick();
                ev.preventDefault();
                ev.stopPropagation();
            }
        }

        function getStartPageIndex() {
            if (!localStorage) {
                return 0;
            }

            var pageIndex = localStorage.getItem('oc-onboarding-start-page');

            if (pageIndex !== null) {
                pageIndex = parseInt(pageIndex);
            }

            if (pageIndex === null || pageIndex < 0 || pageIndex > localStorage.length-1) {
                pageIndex = 0;
            }

            return pageIndex;
        }

        function setStartPageIndex(pageIndex) {
            if (!localStorage) {
                return;
            }

            localStorage.setItem('oc-onboarding-start-page', pageIndex);
        }

        function getCollapsed()
        {
            if (!localStorage) {
                return false;
            }

            return localStorage.getItem('oc-onboarding-collapsed') == 1;
        }

        function setCollapsed(collapsed) {
            if (!localStorage) {
                return;
            }

            localStorage.setItem('oc-onboarding-collapsed', collapsed ? 1 : 0);
        }

        init();
    };

    addEventListener('page:load', function() {
        if (!$(document.body).hasClass('outer') && $.oc.backendUrl) {
            new OnboardingPopup();
        }
    });
}($);