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
                     ->getRepository('DTBUserBundle:DTBUser');
        
        $user = $repository->find($id);
        
        if ($user->getId() == $this->getUser()->getId())
        {
            return $this->redirect($this->generateUrl("fos_user_profile_show"));
        }
        
        return $this->render('DTBUserBundle:Profile:show_user.html.twig', array('user' => $user));
    }

}

?>
