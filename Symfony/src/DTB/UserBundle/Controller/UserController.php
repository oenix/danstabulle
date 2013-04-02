<?php

namespace DTB\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\UserBundle\Entity\DTBUser;

class UserController extends Controller {

    /**
     * Show the requested user
     */
    public function showUserAction($id) {
        $repository = $this->getDoctrine()
                     ->getManager()
                     ->getRepository('DTBUserBundle:User');
        
        $user = $repository->find($id);
        var_dump($user);
    }

}

?>
