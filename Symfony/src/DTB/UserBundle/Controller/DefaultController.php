<?php

namespace DTB\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\UserBundle\Entity\User;

class DefaultController extends Controller {

    public function indexAction($name) {

// Pour récupérer le service UserManager du bundle
        $userManager = $this->get('fos_user.user_manager');

// Pour récupérer la liste de tous les utilisateurs
        $users = $userManager->findUsers();
        var_dump($users);
    }

}
