<?php

namespace DTB\UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class DTBUserBundle extends Bundle {

    public function getParent() {
        return 'FOSUserBundle';
    }
}
