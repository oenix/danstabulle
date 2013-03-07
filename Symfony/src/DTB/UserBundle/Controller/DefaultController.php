<?php

namespace DTB\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\UserBundle\Entity\Users;

class DefaultController extends Controller {

    public function indexAction($name) {

        $user = new Users();

        $formBuilder = $this->createFormBuilder($user);
        $formBuilder->add('username', 'text')
                ->add('password', 'password');
        $form = $formBuilder->getForm();
        $request = $this->get('request');

        if ($request->getMethod() == 'POST') {
            $form->bind($request);
            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($user);
                $em->flush();
            }
        }

        $repository = $this->getDoctrine()->getManager()->getRepository('DTBUserBundle:Users');
        $users = $repository->findAll();

        return $this->render('DTBUserBundle:Default:index.html.twig', array('name' => $name, 'form' => $form->createView(), 'users' => $users));
    }

}
