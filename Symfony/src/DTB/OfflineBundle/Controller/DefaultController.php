<?php

namespace DTB\OfflineBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $userManager = $this->get('fos_user.user_manager');
        $users = $userManager->findUsers();
        var_dump($users);
        
        return $this->render('DTBOfflineBundle:Default:index.html.twig', array('name' => $this->getUser()->getUsername()));
    }
}
